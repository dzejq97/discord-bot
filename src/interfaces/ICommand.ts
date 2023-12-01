import MainClient from "src/main_client";
import CommandsManager from "../classes/CommandsManager";
import { Message } from "discord.js";
import ComandArgument from "../classes/CommandArgument";

export interface ICommand {
    meta: {
        name: string,
        aliases?: string[],
        requiredPermissions?: bigint[],
        description?: string,
        category?: string,
        delete_message_on_trigger?: boolean;
    },
    execute(context: IContext):void;
}

export interface IContext {
    client: MainClient;
    commands_manager: CommandsManager;
    message: Message;
    used_prefix?: string;
    used_alias?: string;
    arguments?: ComandArgument[] | null;
}

