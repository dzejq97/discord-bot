import CustomClient from "./CustomClient";
import { db_LevelUpdateTimeout, XpMultiply, XpPerMessage, XpStep } from "../config.json";
import { Collection, Message } from "discord.js";
import ms from "ms";
import { User } from "@prisma/client"


export default class LevelingManager {
    client: CustomClient;
    update_cache: Collection<string, User> = new Collection();

    constructor(client: CustomClient) {
        this.client = client;

        setTimeout(async () => await this.pushAllCacheUpdates(), ms(db_LevelUpdateTimeout));
    }

    async pushAllCacheUpdates() {
        this.update_cache.forEach(async (user, id) => {
            await this.updateUserCache(user);
        });

        setTimeout(async () => await this.pushAllCacheUpdates(), ms(db_LevelUpdateTimeout));
    }

    async updateUserCache(user: User) {
        try {
            await this.client.prisma.user.update({
                where: { id: user.id},
                data: {
                    experience: user.experience,
                    level: user.level,
                    next_level_exp: user.next_level_exp,
                }
            });
        } catch (error) {
            return this.client.logger.error(String(error));
        } finally {
            return this.update_cache.delete(user.id);
        }
    }

    calculateNextLevelExp(currentLevel: number): number {
        const next_level_experience = XpStep * XpPerMessage * (XpMultiply * currentLevel);
        return next_level_experience;

    }

    async resolveExperience(msg: Message) {
        let user;

        if (this.update_cache.has(msg.author.id)) {
            user = this.update_cache.get(msg.author.id);
        } else {
            try {
                user = await this.client.prisma.user.findFirst({ where: { id: msg.author.id}});
            } catch (error) {
                return this.client.logger.error(String(error));
            }
        }

        if (!user ||
            user.experience == null ||
            user.next_level_exp == null ||
            user.level == null) return;
        
        user.experience += XpPerMessage;

        if (user.experience >= user.next_level_exp) {
            user.level++;
            const exp_left = user.experience - user.next_level_exp;
            user.experience = exp_left;
            user.next_level_exp = this.calculateNextLevelExp(user.level);

            const emb = this.client.embeds.empty();
            emb.setTitle(`${msg.author.username} advanced from level ${user.level - 1} to level ${user.level}!`);
            
            try {
                await msg.channel.send({embeds: [emb]});
                await this.updateUserCache(user);
            } catch (error) {
                return this.client.logger.error(String(error));
            } finally {
                return;
            }
        } else {
            this.update_cache.set(msg.author.id, user);
            return;
        }
    }
}