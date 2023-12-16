import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import { PrismaClient } from '@prisma/client';

export = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        const prisma = new PrismaClient();
        try {
            if (!await prisma.user.findUnique({where: { id: member.user.id}})) {
                await prisma.user.create({
                    data: {
                        user_id: member.user.id,
                    }
                })
            }
        } catch (error) {
            console.log(error);
        } finally {
            prisma.$disconnect();
        }
        return;
    }
};