import { ICommand, IContext } from "src/interfaces/ICommand";

export const command: ICommand = {
    meta: {
        name: "hello",
        aliases: ['hi']
    },

    async execute(context: IContext) {
        const manager = context.commands_manager;

        if (!context.arguments)
            return context.message.reply({embeds: [context.client.embeds.info('Mention user you want to greet.')]});

        if (!context.arguments[0].isMemberMention())
            return context.message.reply({embeds: [context.client.embeds.info('Mention user you want to greet.')]});

        const emb = context.client.embeds.info(`<@${context.message.author.id}> says *hello* to ${context.arguments[0].content}`)
        return context.message.reply({embeds: [emb]});
    }
}