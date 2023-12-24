import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';

export = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        
        try {
            await client.mongo.User.deleteOne({ id: member.user.id });
        } catch (error) {
            client.logger.error(String(error));
        }
        return;
        
    }
};