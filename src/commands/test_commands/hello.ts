import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";

export const command: ICommand = {
    meta: {
        name: "hello",
        aliases: ['hi']
    },

    async execute(context: CommandContext) {
        if (!context.arguments)
            return context.message.reply('Mention user you want to greet.');

        if (!context.arguments[0].isMemberMention())
            return context.message.reply('Mention user you want to greet.');

        await context.message.reply(`<@${context.message.author.id}> says *hello* to ${context.arguments[0].content}`)
        return;
    }
}