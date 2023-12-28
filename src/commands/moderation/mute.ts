import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";
import ms from "ms"

export const command: ICommand = {
    meta: {
        name: "mute",
        description: 'Timeout member',
        aliases: ["m"],
        required_permissions: [PermissionFlagsBits.KickMembers],
        proper_usage: "!mute <member> <time> [reason]",
    },

    async execute(context: CommandContext) {
            if (!await context.canExecute()) return;

            const authorMember = context.message.member;
            const targetMember = await context.arguments?.shift()?.parseToMember();
            const time = context.arguments?.shift()?.parseToTime();
            const reason = context.joinLeftArguments();

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