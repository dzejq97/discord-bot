import CustomClient from "./CustomClient";
import { DB_XpUpdateTimeout, XpMultiply, XpPerMessage, XpStep } from "../config.json";
import { Collection, Message } from "discord.js";
import ms from "ms";
import { User } from "@prisma/client"


export default class LevelingManager {
    client: CustomClient;
    update_cache: Collection<string, User> = new Collection();

    constructor(client: CustomClient) {
        this.client = client;

        setTimeout(async () => await this.DBPushUpdates(), ms(DB_XpUpdateTimeout));
    }

    async DBPushUpdates() {
        this.update_cache.forEach(async (user, id) => {
            await this.updateUser(user);
        });

        setTimeout(async () => await this.DBPushUpdates(), ms(DB_XpUpdateTimeout));
    }

    async updateUser(user: User) {
        try {
            await this.client.prisma.user.update({
                where: { id: user.id},
                data: {
                    xp: user.xp,
                    level: user.level,
                    req_xp: user.req_xp,
                }
            });
        } catch (error) {
            return this.client.logger.error(String(error));
        } finally {
            return this.update_cache.delete(user.id);
        }
    }

    calculateNextLevelExp(currentLevel: number): number {
        const next_level_xp = XpStep * XpPerMessage * (XpMultiply * currentLevel);
        return next_level_xp;

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
            user.xp == null ||
            user.req_xp == null ||
            user.level == null) return;
        
        user.xp += XpPerMessage;

        if (user.xp >= user.req_xp) {
            user.level++;
            const xp_left = user.xp - user.req_xp;
            user.xp = xp_left;
            user.req_xp = this.calculateNextLevelExp(user.level);

            const emb = this.client.embeds.empty();
            emb.setTitle(`${msg.author.username} advanced from level ${user.level - 1} to level ${user.level}!`);
            
            try {
                await msg.channel.send({embeds: [emb]});
                await this.updateUser(user);
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