import { Events, Guild } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import { PrismaClient } from '@prisma/client';

export = {
    name: Events.GuildCreate,
    once: false,

    async execute(client: CustomClient, guild: Guild) {
        client.logger.info(`guild joined ${guild.name}:${guild.id}`);
        const prisma = new PrismaClient();
        try {
            if (!await prisma.guild.findUnique({where: { id: guild.id}})) {
                await prisma.guild.create({
                    data: {
                        guild_id: guild.id,
                        owner_id: guild.ownerId,
                    }
                })
            }

            client.logger.info(`database added ${guild.name}:${guild.id}`);
        } catch (error) {
            client.logger.error(`failed adding guild database record ${guild.name}:${guild.id}`);
            console.log(error);
        } finally {
            prisma.$disconnect();
        }

    }
};