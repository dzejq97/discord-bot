import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export const command: ICommand = {
    meta: {
        name: "unmute",
        aliases: ["um"],
        required_permissions: [PermissionFlagsBits.KickMembers],
        proper_usage: "!unmute <member>",
    },
    async execute(context: CommandContext) {
        try {
            if (!context.verifyAuthorPermissions(this.meta.required_permissions))
                return await context.executionFailed(`You have no permissions`);

            const authorMember = context.message.member;
            const targetMember = await context.arguments?.shift()?.parseToMember();
            
            if (!targetMember || !authorMember)
                return await context.executionFailed(`Failed executing command`, this.meta.proper_usage);
            
            const emb = context.client.embeds.empty();
            emb.setTitle(`${targetMember.user.username} was unmuted.`);
            emb.setFooter({text: `by ${authorMember.user.username}`})

            await context.message.channel.send({embeds: [emb]});
            return await targetMember.timeout(null);
        } catch (error) {
            context.client.logger.error(String(error));
        }
    }
}