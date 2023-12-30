import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import ms from "ms";
import { GuildMember } from "discord.js";

export const command: ICommand = {
    meta: {
        name: "profile",
        aliases: ["p", "profil", "prof"],
        cooldown: {
            name: "CMD_profile",
            time: "5s",
            feedback_message: true,
            database_save: false,
        }
    },
    async execute(context: CommandContext) {
        if (!await context.canExecute()) return;

        let target: GuildMember | null | undefined;
        if (context.arguments) {
            try {
                target = await context.arguments.shift()?.parseToMember();
            } catch (err) {
                if (err instanceof Error) console.log(err.message);
            } finally {
                target = context.message.member;
            }
        }
        if (!target || !context.message.guild) return;

        let img;
        img = await context.client.canvas.getUserProfileBanner(target, context.message.guild);
        if (!img) return;
        
        const reply = await context.message.reply({files: [img]});
        setTimeout(async () => await reply.delete(), ms('15s'));
        setTimeout(async () => await context.message.delete(), ms('15s'));
    }
}