import { Events, GuildMember } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(client: MainClient, member: GuildMember) {
        try {
            if (!await client.prisma.user.findUnique({where: { id: member.user.id}})) {
                await client.prisma.user.create({
                    data: {
                        id: member.user.id,
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
        return;
    }
};