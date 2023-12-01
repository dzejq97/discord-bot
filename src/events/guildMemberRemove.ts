import { Events, GuildMember } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(client: MainClient, member: GuildMember) {
        return;
    }
};