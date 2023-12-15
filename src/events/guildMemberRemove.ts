import { PrismaClient } from '@prisma/client';
import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';

export = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        const prisma = new PrismaClient();
        try {
            await prisma.user.delete({
                where: {
                    id: member.user.id,
                }
            });
        } catch (error) {
            console.log(error);
        }
        return;
    }
};