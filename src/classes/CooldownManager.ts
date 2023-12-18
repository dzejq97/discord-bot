import { Collection } from "discord.js";
import CustomClient from "./CustomClient";
import { Cooldown } from "@prisma/client";
import ms from "ms";

export default class CooldownManager {
    client: CustomClient;
    active: Collection<string, Cooldown> = new Collection();

    constructor (client: CustomClient) {
        this.client = client;
    }

    async initLoadCooldowns() {
        try {
            const cooldowns = await this.client.prisma.cooldown.findMany();
            for ( const cooldown of cooldowns.values()) {
                if (cooldown.start.getTime() + cooldown.time <= Date.now()) {
                    await this.client.prisma.cooldown.delete({where: { id: cooldown.id }});
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

    async setCooldown(user_id: string, name: string, time: number | string) {
        let cooldown_time;
        if (typeof time === 'string') cooldown_time = ms(time);
        else cooldown_time = time;
        try {
            const cooldown = await this.client.prisma.cooldown.create({data: {
                name: name,
                time: cooldown_time,
                user: { connect: { id: user_id}}
            }});
            this.active.set(user_id, cooldown);
            setTimeout(async () => await this.clearCooldown(user_id, name), cooldown.time);
            return;
        } catch (error) {
            return this.client.logger.error(String(error));
        }
    }

    async clearCooldown(user_id: string, name: string) {
        const cooldown = this.active.find(
            cooldown => cooldown.name === name && cooldown.user_id === user_id
        );
        if (!cooldown) return;

        try {
            await this.client.prisma.cooldown.delete({
                where: { id: cooldown.id }
            });
            this.active.delete(user_id);
        } catch (error) {
            return this.client.logger.error(String(error));
        }
    }
}