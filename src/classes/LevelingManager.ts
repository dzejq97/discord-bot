import CustomClient from "./CustomClient";
import { db_LevelUpdateTimeout, Exp_per_message } from "../config.json";
import { PrismaClient } from "@prisma/client";
import { Collection, Message } from "discord.js";
import ms from "ms";

interface ILevelingUpdateCache {
    user_id: string;
    experience_increment?: number;
    level_increment?: number;
}

export default class LevelingManager {
    client: CustomClient;
    update_cache: Collection<string, ILevelingUpdateCache> = new Collection();

    constructor(client: CustomClient) {
        this.client = client;

        setTimeout(async () => await this.db_update(), ms(db_LevelUpdateTimeout));
    }
    async db_update() {
        let count = 0;

        this.update_cache.forEach(async (userUpdate, user_id) => {
            count++;

            try {
                await this.client.prisma.user.update({
                    where: { id: user_id},
                    data: {
                    experience: { increment: userUpdate.experience_increment }}});
            } catch (error) {
                this.client.logger.error(String(error));
            }

            this.update_cache.delete(user_id);
        });
        if (count > 0)
            this.client.logger.info(`db: Pushed updates of ${count} users experience to database`);

        setTimeout(async () => await this.db_update(), ms(db_LevelUpdateTimeout));
    }

    resolveMessageExp(msg: Message) {
        let userUpdate: ILevelingUpdateCache | undefined;

        if (!this.update_cache.has(msg.author.id)) {
            userUpdate = { user_id: msg.author.id };
        } else {
            userUpdate = this.update_cache.get(msg.author.id);
            if (!userUpdate) return;
        }

        if (!userUpdate.experience_increment) userUpdate.experience_increment = Exp_per_message;
        else userUpdate.experience_increment += Exp_per_message;


        this.update_cache.set(msg.author.id, userUpdate);
    }
}