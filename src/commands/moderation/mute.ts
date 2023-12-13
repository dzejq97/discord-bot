import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";
import ms from "ms"

export const command: ICommand = {
    meta: {
        name: "mute",
        aliases: ["m"],
        requiredPermissions: [PermissionFlagsBits.BanMembers],
    },

    async execute(context: CommandContext) {
        if (!context.message.member) return;
        if (!this.meta.requiredPermissions || !context.message.member.permissions.has(this.meta.requiredPermissions))
            return;
        if (!context.arguments || !context.arguments[0].isMemberMention())
            return context.message.reply({embeds: [context.client.embeds.info('Use !mute <user> [reason]')]});

        let muteMember;
        try {
            muteMember = await context.arguments.shift()?.getMember();
            if (!muteMember) return context.message.reply({embeds: [context.client.embeds.info('Cannot find member')]});
        } catch (error) {
            return console.log(error);
        }
    }
}