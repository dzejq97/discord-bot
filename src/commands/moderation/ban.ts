import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export const command: ICommand = {
    meta: {
        name: "ban",
        description: 'Ban member',
        aliases: ["b"],
        required_permissions: [PermissionFlagsBits.BanMembers],
        proper_usage: "!ban <member> [reason]"
    },

    async execute(context: CommandContext) {
        try {
            if (!await context.canExecute()) return;
    
            let targetMember, authorMember, reason;
            targetMember = await context.arguments?.shift()?.parseToMember();
            authorMember = context.message.member;
            reason = context.joinLeftArguments();
    
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