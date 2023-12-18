import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";

export const command: ICommand = {
    meta: {
        name: 'ping',
        aliases: ['pong'],
        description: 'Replies with Pong!',
        cooldown: {
            name: 'TO_ping',
            time: '30s'
        }
    },
    async execute(context: CommandContext) {
        if (context.cooldown(this)) return;

        if (context.used_alias === 'ping') context.message.reply('pong');
        else context.message.reply('ping');
    }
}