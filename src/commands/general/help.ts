import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import ms from "ms";

export const command: ICommand = {
    meta: {
        name: 'help',
        aliases: ['h'],
        description: 'Commands list',
    },
    async execute(context: CommandContext) {
        await context.message.reply({embeds: context.client.embeds.helpEmbeds});
        setTimeout( async () => await context.message.delete(), ms('20s'));
    }
}