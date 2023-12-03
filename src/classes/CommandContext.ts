export interface IContext {
    client: MainClient;
    commands_manager: CommandsManager;
    message: Message;
    used_prefix?: string;
    used_alias?: string;
    arguments?: Array<ComandArgument>,
}

import MainClient from "src/classes/CustomClient";
import CommandsManager from "./CommandsManager";
import ComandArgument from "./CommandArgument";
import { Message, User, GuildMember, Guild} from "discord.js";

export default class CommandContext {
    client: MainClient;
    commands_manager: CommandsManager;
    message: Message;
    used_prefix?: string;
    used_alias?: string;
    arguments?: Array<ComandArgument>;
    constructor (client: MainClient, commands_manager: CommandsManager, message: Message) {
        this.client = client;
        this.commands_manager = commands_manager;
        this.message = message;
    }
}