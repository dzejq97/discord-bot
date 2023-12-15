import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export const command: ICommand = {
    meta: {
        name: 'kick',
        aliases: ['k'],
        description: 'Kick member',
        proper_usage: "!kick <member> [reason]",
        required_permissions: [PermissionFlagsBits.KickMembers],
    },
    async execute(context: CommandContext) {
        try {
            if (!context.verifyAuthorPermissions(this.meta.required_permissions))
                return await context.executionFailed(`You have no permissions`);

            const authorMember = context.message.member;
            const targetMember = await context.arguments?.shift()?.parseToMember();
            const reason = context.joinArguments();

            if (!targetMember || !authorMember)
                return await context.executionFailed(`Failed executing command`, this.meta.proper_usage);
            if (!context.verifyTargetPermissions(targetMember))
                return await context.executionFailed(`Cannot kick another moderator.`);

            const emb = context.client.embeds.empty();
            emb.setTitle(`${targetMember.user.username} was kicked.`);
            emb.setFooter({text: `by ${authorMember.user.username}`});
            if (reason)
                emb.setDescription(`Reason: ${reason}`);

                await context.message.channel.send({embeds: [emb]});
                return await targetMember.kick();
        } catch (error) {
            return context.client.logger.error(String(error));
        }
    }
}