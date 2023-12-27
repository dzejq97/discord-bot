import { Collection } from "discord.js";
import CustomClient from "./CustomClient";
import ms from "ms";
import { HydratedDocument } from "mongoose";
import { ICooldown } from "src/mongo/models/cooldown";

export default class CooldownManager {
    client: CustomClient;
    active: Collection<string, HydratedDocument<ICooldown>> = new Collection();

    constructor (client: CustomClient) {
        this.client = client;
    }

    async initLoadCooldowns() {
        try {
            const cooldowns = await this.client.mongo.Cooldown.find();

            for ( const cooldown of cooldowns.values()) {
                if (cooldown.start.getTime() + cooldown.time <= Date.now()) {
                    await this.client.mongo.Cooldown.findOneAndDelete({ _id: cooldown._id })
                    continue;
                } else {
                    this.setCooldown(cooldown.user_id, cooldown.name, cooldown.time);
                    continue;
                }
            }
        } catch (error) {
            this.client.logger.failed(String(error));
        }
    }

    async setCooldown(user_id: string, name: string, time: number | string, save?: boolean): Promise<HydratedDocument<ICooldown> | undefined> {
        let cooldown_time;
        if (typeof time === 'string') cooldown_time = ms(time);
        else cooldown_time = time;

        try {
            const cooldown = new this.client.mongo.Cooldown({
                name: name,
                time: cooldown_time,
                user_id: user_id
            });
            if (save) await cooldown.save();

            this.active.set(user_id, cooldown);
            setTimeout(async () => await this.clearCooldown(user_id, name), cooldown_time);            
        } catch (error) {
            return;
        }
    }

    async clearCooldown(user_id: string, name: string) {
        const cooldown = this.active.find(
            cooldown => cooldown.name === name && cooldown.user_id === user_id
        );
        if (!cooldown) return;

        try {
            await this.client.mongo.Cooldown.findOneAndDelete({ _id: cooldown._id })
            this.active.delete(user_id);
        } catch (error) {
            return this.client.logger.error(String(error));
        }
    }
}