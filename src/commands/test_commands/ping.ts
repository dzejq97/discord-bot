import { ICommand, IContext } from "src/interfaces/ICommand";

export const command: ICommand = {
    meta: {
        name: 'ping',
        aliases: ['pong'],
        description: 'Replies with Pong!',
    },
    async execute(context: IContext) {
        if (context.used_alias === 'ping') context.message.reply('pong');
        else context.message.reply('ping');
    }
}