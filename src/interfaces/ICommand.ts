import CommandContext from "../classes/CommandContext";
import { Collection } from "discord.js";

export interface ICommand {
    meta: {
        name: string,
        aliases?: string[],
        requiredPermissions?: bigint[],
        description?: string,
        category?: string,
        delete_message_on_trigger?: boolean;
        reply_strings?: Collection<string, string>;
    },
    execute(context: CommandContext):void;
}



