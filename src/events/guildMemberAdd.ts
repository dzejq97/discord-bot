import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import {XpStep} from "../config.json"

export = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        await client.mongo.memberCreate(member);

        return;
        
    }
};