import CommandContext from "../classes/CommandContext";

export interface ICommand {
    meta: {
        name: string,
        aliases?: string[],
        required_permissions?: bigint[],
        description?: string,
        proper_usage?: string;
        category?: string,
        delete_message_on_trigger?: boolean;
        cooldown?: ICooldown;
    },
    execute(context: CommandContext):void;
}

interface ICooldown {
    name: string,
    time: string,
    feedback_message?: boolean;
    database_save?: boolean;
}



