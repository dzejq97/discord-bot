import { Events, GuildMember } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';

export = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(client: CustomClient, member: GuildMember) {
        
        try {
            await client.mongo.Member.deleteOne({ id: member.user.id, guild_id: member.guild.id });
        } catch (error) {
            client.logger.error(String(error));
        }
        return;
        
    }
};