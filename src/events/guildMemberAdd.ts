import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import {XpStep} from "../config.json"

export = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        try {
            if (!await client.prisma.user.findUnique({where: { id: member.user.id}})) {
                await client.prisma.user.create({
                    data: {
                        id: member.user.id,
                        req_xp: XpStep
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
        return;
    }
};