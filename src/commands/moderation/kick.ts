import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export const command: ICommand = {
    meta: {
        name: 'kick',
        aliases: ['k'],
        description: 'Kick member',
        requiredPermissions: [PermissionFlagsBits.KickMembers],
    },
    async execute(context: CommandContext) {
        if (!context.message.member) return;
        if (!this.meta.requiredPermissions || !context.message.member.permissions.has(this.meta.requiredPermissions))
            return;
        if (!context.arguments || !context.arguments[0].isMemberMention())
            return context.message.reply({embeds: [context.client.embeds.info('Use !kick [user] <reason>')]});

        let kickMember;

        try {
            kickMember = await context.arguments.shift()?.parseToMember();
        } catch (error) {
            return console.log(error);
        }

        if (!kickMember) return context.message.reply({embeds: [context.client.embeds.info('Cannot find member')]});
        let author = context.message.author;
        if (kickMember.user === author) return context.message.reply({embeds: [context.client.embeds.info('Cannot kick yourself')]});
        if (kickMember.permissions.has([
            PermissionFlagsBits.Administrator, 
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.KickMembers])) return context.message.reply({embeds: [context.client.embeds.info('Cannot kick another moderator')]});

        let reason: string = "";
        for (const arg of context.arguments) reason += arg.content;

        if (!reason.length) {
            const emb = context.client.embeds.empty();
            emb.setTitle(`${kickMember.user.username} was kicked from server`);
            emb.setFooter({text: `by ${context.message.member.user.username}`});
            try {
                await context.message.channel.send({embeds: [emb]});
    
                //await kickMember.kick(reason)
                return;
            } catch (error) {
                return console.log(error);
            }
        }
        else {
            const emb = context.client.embeds.empty();
            emb.setTitle(`${kickMember.nickname} was kicked from server`);
            emb.setDescription(`Reason: ${reason}`);
            emb.setFooter({text: `by ${context.message.member.nickname}`});
            try {
                await context.message.channel.send({embeds: [emb]});
    
                //await kickMember.kick(reason);
                return;
            } catch (error) {
                return console.log(error);
            }
        }

        
    }
}