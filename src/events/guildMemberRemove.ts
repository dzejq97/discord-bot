import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';

export = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        try {
            if (await client.prisma.user.findFirst({ where: { id: member.id }})) {
                await client.prisma.user.delete({ where: { id: member.id }});
            }
        } catch (error) {

        }
        return;
    }
};