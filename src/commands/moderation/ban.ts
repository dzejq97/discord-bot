import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export const command: ICommand = {
    meta: {
        name: "ban",
        aliases: ["b"],
        requiredPermissions: [PermissionFlagsBits.BanMembers],
    },

    async execute(context: CommandContext) {
        if (!context.message.member) return;
        if (!this.meta.requiredPermissions || !context.message.member.permissions.has(this.meta.requiredPermissions)) return;

        if (!context.arguments || !context.arguments[0].isMemberMention())
            return context.message.reply({embeds: [context.client.embeds.info('Use !ban [user] <reason>')]});

        let banMember;
        try {
            banMember = await context.arguments.shift()?.getMember();
            if (!banMember) 
                return context.message.reply({embeds: [context.client.embeds.info('Cannot find member')]})
        } catch(error) {
            return console.log(error)
        }
        const author = context.message.author;
        if (banMember.user === author) return;
        if (banMember.permissions.has([
            PermissionFlagsBits.Administrator,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.KickMembers])) return;

        let reason: string = "";
        for (const arg of context.arguments) reason += arg.content;

        if (!reason.length) {
            const emb = context.client.embeds.empty();
            emb.setTitle(`${banMember.user.username} was banned from server`);
            emb.setFooter({text: `by ${author.username}`});
            try {
                await context.message.channel.send({embeds: [emb]});

                //await banMember.ban();
                return;
            } catch (error) {
                return console.log(error);
            }
        } else {
            const emb = context.client.embeds.empty();
            emb.setTitle(`${banMember.nickname} was banned from server`);
            emb.setDescription(`Reason: ${reason}`);
            emb.setFooter({text: `by ${author.username}`});
            try {
                await context.message.channel.send({embeds: [emb]});

                //await banMember.ban({reason: reason});
                return;
            } catch (error) {
                console.log(error);
            }
        }
        
    }
}