import { PrismaClient } from '@prisma/client';
import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';

export = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        return;
    }
};