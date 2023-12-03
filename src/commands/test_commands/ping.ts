import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";

export const command: ICommand = {
    meta: {
        name: 'ping',
        aliases: ['pong'],
        description: 'Replies with Pong!',
    },
    async execute(context: CommandContext) {
        if (context.used_alias === 'ping') context.message.reply('pong');
        else context.message.reply('ping');
    }
}