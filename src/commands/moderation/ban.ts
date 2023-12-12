import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";
import { Collection } from "discord.js";

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
            if (!banMember) return 
        }
        
    }
}