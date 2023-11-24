import { Events } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.ClientReady,
    once: true,

    async execute(client: MainClient) {
        client.logger.success(`Client ready! Logged in as ${client.user?.tag}`);
    }
};