import { Events } from "discord.js";
import UClient from "src/classes/UClient";
import IEvent from "src/interfaces/IEvent";

module.exports = <IEvent>{
    name: Events.ClientReady,
    once: true,
    restricted: true,
    
    async execute(client: UClient) {
        
    }
}