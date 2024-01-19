import { Events, GuildMember } from "discord.js";
import UClient from "src/classes/UClient";
import IEvent from "src/interfaces/IEvent";

module.exports = <IEvent>{
    name: Events.GuildMemberAdd,
    once: false,
    restricted: false,
    async execute(client: UClient, member: GuildMember) {
        client.log.info(`Member ${member.displayName}:${member.id} joined ${member.guild.name}:${member.guild.id}`)
        await client.database.members.getOrCreate(member, member.guild.id);
    }
}