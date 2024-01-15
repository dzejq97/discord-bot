import { Events, Message } from "discord.js";
import UClient from "src/classes/UClient";
import IEvent from "src/interfaces/IEvent";

module.exports = <IEvent>{
    name: Events.MessageCreate,
    once: false,
    restricted: false,
    async execute(client: UClient, msg: Message) {
        try {
            if (await client.commands.seek(msg)) return;
        } catch (err) {
            if (err instanceof Error) console.log(err.message);
            else console.log(String(err));
            return;
        }
    }
}