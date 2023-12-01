import { Events, Guild } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildCreate,
    once: false,

    async execute(client: MainClient, guild: Guild) {
        try {
            if (!await client.prisma.guild.findUnique({where: { id: guild.id}})) {
                await client.prisma.guild.create({
                    data: {
                        id: guild.id,
                        owner_id: guild.ownerId,
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
};