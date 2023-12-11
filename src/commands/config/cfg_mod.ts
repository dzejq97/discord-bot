import CommandContext from "../../classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";
import { ICommand } from "../../interfaces/ICommand"

export const command: ICommand = {
    meta: {
        name: 'cfg_mod',
        aliases: ['configure_moderation'],
        description: 'Setting for moderation module',
        requiredPermissions: [PermissionFlagsBits.Administrator],
    },
    async execute(context: CommandContext) {
        if (!context.message.member) return;
        if (!this.meta.requiredPermissions || !context.message.member.permissions.has(this.meta.requiredPermissions[0])) return;
    }
}