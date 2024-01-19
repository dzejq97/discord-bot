import { Events, GuildMember } from "discord.js";
import UClient from "src/classes/UClient";
import IEvent from "src/interfaces/IEvent";

module.exports = <IEvent>{
    name: Events.GuildMemberRemove,
    once: false,
    restricted: false,
    async execute(client: UClient, member: GuildMember) {
        client.log.info(`Member ${member.displayName}:${member.id} left ${member.guild.name}:${member.guild.id}`);
        await client.database.members.remove(member, member.guild);
    }
}