import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export const command: ICommand = {
    meta: {
        name: "ban",
        aliases: ["b"],
        required_permissions: [PermissionFlagsBits.BanMembers],
        proper_usage: "!ban <member> [multi_string]"
    },

    async execute(context: CommandContext) {
        try {
            if (!context.verifyAuthorPermissions(this.meta.required_permissions))
                return await context.executionFailed('You have no permission to use this command.');
    
            let targetMember, authorMember, reason;
            targetMember = await context.arguments?.shift()?.parseToMember();
            authorMember = context.message.member;
            reason = context.joinArguments();
    
            if (!targetMember || !authorMember)
                return await context.executionFailed('Failed executing command', this.meta.proper_usage);
            if (!context.verifyTargetPermissions(targetMember))
                return await context.executionFailed('Cannot ban another moderator.');
    
            const emb = context.client.embeds.empty();
            emb.setTitle(`${targetMember.user.username} was banned from server.`);
            emb.setFooter({text: `by ${authorMember.user.username}`});
            if (reason) emb.setDescription(`Reason: ${reason}`);
    
            await context.message.channel.send({embeds: [emb]});
            return await targetMember.ban();
        } catch (error) {
            return context.client.logger.error(String(error));
        }
    }
}