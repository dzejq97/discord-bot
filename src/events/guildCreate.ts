import { Events, Guild } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';

export = {
    name: Events.GuildCreate,
    once: false,

    async execute(client: CustomClient, guild: Guild) {
        client.logger.info(`guild joined ${guild.name}:${guild.id}`);
        await client.mongo.guildCreateAndSync(guild);
    }
};