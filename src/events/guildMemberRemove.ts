import { Events, GuildMember } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(client: MainClient, member: GuildMember) {
        try {
            await client.prisma.user.delete({
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