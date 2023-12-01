import { Events, Guild } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildDelete,
    once: false,

    async execute(client: MainClient, guild: Guild) {

        try {
            await client.prisma.guild.delete({
                where: {
                    id: guild.id,
                }
            });
        } catch (error) {
            console.log(error);
        }
        return;
    }
};