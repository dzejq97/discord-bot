import { Events, Guild } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildDelete,
    once: false,

    async execute(client: MainClient, guild: Guild) {
        client.logger.info(`guild left ${guild.name}:${guild.id}`);

        try {
            await client.prisma.guild.delete({
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