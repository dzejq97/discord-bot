import { ClientEvents, Events } from "discord.js";
import UClient from "../classes/UClient";

export default interface IEvent {
    name: keyof ClientEvents;
    once: boolean;
    restricted?: boolean;
    module?: any;
    execute(client:UClient, ... args:any[]): void;
}