import { Events, Guild } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildCreate,
    once: false,

    async execute(client: MainClient, guild: Guild) {
        client.logger.info(`guild joined ${guild.name}:${guild.id}`);
        try {
            if (!await client.prisma.guild.findUnique({where: { id: guild.id}})) {
                await client.prisma.guild.create({
                    data: {
                        id: guild.id,
                        owner_id: guild.ownerId,
                    }
                })
            }

            client.logger.info(`database added ${guild.name}:${guild.id}`);
        } catch (error) {
            client.logger.error(`failed adding guild database record ${guild.name}:${guild.id}`);
            console.log(error);
        }

    }
};