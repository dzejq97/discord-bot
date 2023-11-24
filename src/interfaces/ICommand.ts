import CommandContext from 'src/classes/CommandContext';

export interface ICommand {
    meta: {
        name: string,
        aliases: string[],
        requiredPermissions?: bigint[],
        description?: string,
        category?: string,
    },
    execute(context: CommandContext):void;
}