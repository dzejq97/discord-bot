import CustomClient from "./CustomClient";
import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";
import ms from "ms";

interface ILevelingUpdateCache {
    user_id: string;
    experience_increment: number;
    level_increment: number;
}

export default class LevelingManager {
    client: CustomClient;
    //prisma: PrismaClient;
    update_cache: ILevelingUpdateCache[] = [];

    constructor(client: CustomClient) {
        this.client = client;
        //this.prisma = new PrismaClient();

        //setTimeout(async () => await this.update(), ms('5s'));
    }
    async update() {
        console.log('update');

        //setTimeout(async () => await this.update(), ms('5s'));
    }

    resolveMessageExp(msg: Message) {

    }
}