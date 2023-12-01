import { Events, GuildMember } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(client: MainClient, member: GuildMember) {
        try {
            await client.prisma.user.upsert({
                where: {
                    id: member.user.id,
                },
                update: {},
                create: {
                    id: member.user.id,
                }
            });
        } catch (error) {
            console.log(error);
        }
        return;
    }
};