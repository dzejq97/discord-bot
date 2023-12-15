import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";
import ms from "ms"

export const command: ICommand = {
    meta: {
        name: "mute",
        aliases: ["m"],
        required_permissions: [PermissionFlagsBits.KickMembers],
        proper_usage: "!mute <member> <time> [reason]",
    },

    async execute(context: CommandContext) {
            console.log('mute executed');
            if (!context.verifyAuthorPermissions(this.meta.required_permissions))
                return await context.executionFailed('You have no permissions');

            const authorMember = context.message.member;
            const targetMember = await context.arguments?.shift()?.parseToMember();
            const time = context.arguments?.shift()?.parseToTime();
            const reason = context.joinArguments();

            if (!targetMember || !authorMember || !time)
                return await context.executionFailed(`Failed executing command`, this.meta.proper_usage);
            if (!context.verifyTargetPermissions(targetMember))
                return await context.executionFailed(`Cannot mute another moderator`);

            const emb = context.client.embeds.empty();
            emb.setTitle(`${targetMember.user.username} was muted for ${ms(time, {long: true})}`);
            emb.setFooter({text: `by ${authorMember.user.username}`});
            if (reason)
                emb.setDescription(`Reason: ${reason}`);

            await context.message.channel.send({embeds: [emb]});
            return await targetMember.timeout(time);
    }
}