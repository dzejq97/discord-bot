import { IContext } from "./IContext";

export interface ICommand {
    meta: {
        name: string,
        aliases: string[],
        requiredPermissions?: bigint[],
        description?: string,
        category?: string,
        delete_message_on_trigger?: boolean;
    },
    execute(context: IContext):void;
}