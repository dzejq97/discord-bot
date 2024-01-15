import IEvent from "src/interfaces/IEvent";
import UClient from "src/classes/UClient";
import { ClientEvents, Events } from "discord.js";

module.exports = <IEvent> {
    name: Events.MessageDelete,
    once: true,

    async execute(client: UClient) {
        console.log('test');
    }
}