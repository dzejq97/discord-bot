import { Events, Guild } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildCreate,
    once: false,

    async execute(client: MainClient, guild: Guild) {
        return;
    }
};