import { Events, Guild } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import { PrismaClient } from '@prisma/client';

export = {
    name: Events.GuildDelete,
    once: false,

    async execute(client: CustomClient, guild: Guild) {
        client.logger.info(`guild left ${guild.name}:${guild.id}`);
        const prisma = new PrismaClient();
        try {
            await prisma.guild.delete({
                where: {
                    id: guild.id,
                }
            });
            client.logger.info(`guild record removed`);
        } catch (error) {
            client.logger.error(`guild record not removed`);
            console.log(error);
        }
        return;
    }
};