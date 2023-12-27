import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import {XpStep} from "../config.json"

export = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        try {
            if (!await client.mongo.User.exists({ id: member.user.id })) {
                const u = new client.mongo.User({
                    id: member.user.id,
                    req_xp: XpStep,
                })
            }
        } catch (error) {
            console.log(error);
        }
        return;
        
    }
};