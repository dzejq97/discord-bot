import CustomClient from "./CustomClient";
import { db_LevelUpdateTimeout, Exp_per_message } from "../config.json";
import { Collection, Message } from "discord.js";
import ms from "ms";
import { User } from "@prisma/client"


export default class LevelingManager {
    client: CustomClient;
    update_cache: Collection<string, User> = new Collection();

    constructor(client: CustomClient) {
        this.client = client;

        setTimeout(async () => await this.db_update(), ms(db_LevelUpdateTimeout));
    }

    async db_update() {
        this.update_cache.forEach(async (user, id) => {

            try {
                await this.client.prisma.user.update({
                    where: { id: id },
                    data: {
                        experience: user.experience,
                    }
                });
            } catch (error) {
                return this.client.logger.error(String(error));
            }

            this.update_cache.delete(id);
        });

        setTimeout(async () => await this.db_update(), ms(db_LevelUpdateTimeout));
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
        if (!user || !user.experience) return;

        user.experience += Exp_per_message;

        this.update_cache.set(msg.author.id, user);
    }
}