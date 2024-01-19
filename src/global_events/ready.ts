import { Collection, Events } from "discord.js";
import UClient from "src/classes/UClient";
import IEvent from "src/interfaces/IEvent";

module.exports = <IEvent>{
    name: Events.ClientReady,
    once: true,
    restricted: true,
    
    async execute(client: UClient) {
        client.log.success(`Logged in as ${client.user?.tag}`);
        
        try {
            await client.database.sync();
            await client.database.cooldowns.load();
        } catch (err) {
            client.log.error(err, true);
        }

        client.log.success(`All set up and ready for work :)`);
    }
}