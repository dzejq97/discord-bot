import { Events, Guild } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';

export = {
    name: Events.GuildDelete,
    once: false,

    async execute(client: CustomClient, guild: Guild) {
        client.logger.info(`guild left ${guild.name}:${guild.id}`);
        try {
            await client.prisma.guild.delete({ where: { id: guild.id }});
            client.logger.info(`DB: guild record removed`);
        } catch (error) {
            return console.log(String(error));
        }
        return;
    }
};