import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export default interface ICommand {
    module?: any,
    subcommands?: ICommand[],
    parent_command?: ICommand,
    meta: {
        name: string,
        aliases?: string[],
        autodelete_trigger_message?: boolean;
        autodelete_reply_message?: boolean;
        requirements?: {
            only_guild_owner?: boolean, // If true command can be executed only by guild owner
            only_guild_administrator?: boolean, // If true command can be executed only by member with admin privilages
            only_guild_moderator?: boolean, // If true command can be executed only by member with timeout/kick privilages
            only_guild?: boolean, // If false can command can be triggered by DM
            author_permissions?: typeof PermissionFlagsBits[]; // Execute when author has given permissions
        },
        cooldown?: {
            name: string, // Unique cooldown name, make sure to not repeat them in different files
            time: string, // Cooldown time in string. Example: '15m'/'2h'/'7d'
            feedback_message?: string, // Send feedback on failed execution with time left to next use
            database_save?: boolean, // Save cooldown to database and reload it in case of bot restart.
        },
    },
    execute(context: CommandContext):void;
}