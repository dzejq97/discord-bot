import CustomClient from "./CustomClient";
import { DB_XpUpdateTimeout, XpMultiply, XpPerMessage, XpStep } from "../config.json";
import { Collection, GuildChannel, GuildMember, Message, TextChannel } from "discord.js";
import ms from "ms";
import { HydratedDocument } from "mongoose";
import { IMember } from "src/mongo/models/member";


export default class LevelingManager {
    client: CustomClient;
    update_cache: Collection<string, HydratedDocument<IMember>> = new Collection();

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
    
    async updateUser(user: HydratedDocument<IMember>) {
        try {
            const g = await this.client.mongo.Member.findOne({
                id: user.id,
                guild: user.guild
            });
            if (!g) return;

            g.xp = user.xp,
            g.level = user.level,
            g.req_xp = user.req_xp

            await g.save();
        } catch (error) {
            return this.client.logger.error(String(error));
        } finally {
            return this.update_cache.delete(user.id);
        }
    } 

    calculateNextLevelExp(currentLevel: number): number {
        const next_level_xp = XpStep * XpPerMessage * (XpMultiply * currentLevel);
        return Math.round(next_level_xp);

    }

    async giveExperience(member: GuildMember, amount: number, default_channel?: TextChannel) {
        let data;
        if (this.update_cache.has(member.id)) {
            data = this.update_cache.get(member.id);
        } else {
            try {
                data = await this.client.mongo.Member.findOne({ id: member.id, guild_id: member.guild.id });
            } catch (err) {
                return this.client.logger.error(String(err));
            }
        }
        if (data) {
            data.xp += amount;
        } else {
            return;
        }

        if (data.xp >= data.req_xp) {
            data.level++;
            data.xp = data.xp - data.req_xp;
            data.req_xp = this.calculateNextLevelExp(data.level);

            if (this.client.mongo.guilds_settings.get(member.guild.id)?.levelup_channel) {
                const levelup_channel_id = this.client.mongo.guilds_settings.get(member.guild.id)?.levelup_channel;
                let channel: TextChannel;
                try {
                    if (levelup_channel_id) {
                        channel = await member.guild.channels.fetch(levelup_channel_id) as TextChannel;
                        if (!channel) throw new Error('NoLevelupChannel')
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        if (err.message === 'NoLevelupChannel' && default_channel) {
                            channel = default_channel;
                        } else return;
                    }
                } finally {
                    const emb = this.client.embeds.empty();
                    emb.setTitle(`${member.displayName} advanced from **${data.level - 1} to **${data.level}** level!`);
                    await channel!.send({embeds: [emb]});
                }
            }
        } else {
            this.update_cache.set(member.id, data);
            return;
        }
    }
    
}