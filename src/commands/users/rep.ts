import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";

export const command: ICommand = {
    meta: {
        name: "rep",
        aliases: ["reputacja", "reputation", "r"],
    },
    async execute(context: CommandContext) {
        console.log('rep');
        const emb = context.client.embeds.empty();

        try {
            let user = await context.client.mongo.User.findOne({ id: context.message.author.id });
            console.log(user);
            if (!user) return;

            emb.setTitle(`You have ${user.reputation} reputation points`);
            await context.message.channel.send({content: `<@${context.message.author.id}>`, embeds: [emb]});
        } catch (error) {
            return context.client.logger.error(String(error));
        }
    }
}