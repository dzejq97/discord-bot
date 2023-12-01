import { Events, Guild } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildCreate,
    once: false,

    async execute(client: MainClient, guild: Guild) {
        try {
            await client.prisma.guild.upsert({
                where: {
                    id: guild.id,
                },
                update: {},
                create: {
                    id: guild.id,
                    owner_id: guild.ownerId,
                }
            })
        } catch (error) {
            console.log(error);
        }
        
        return;
    }
};