import { Events, Guild } from "discord.js";
import UClient from "src/classes/UClient";
import IEvent from "src/interfaces/IEvent";

module.exports = <IEvent>{
    name: Events.GuildDelete,
    once: false,
    restricted: false,
    async execute(client: UClient, guild: Guild) {
        client.log.info(`Guild ${guild.name}:${guild.id} removed`)
        await client.database.guilds.remove(guild);
    }
}