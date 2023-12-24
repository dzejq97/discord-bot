import CommandContext from "../../classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";
import { ICommand } from "../../interfaces/ICommand"

export const command: ICommand = {
    meta: {
        name: 'cfg_mod',
        aliases: ['configure_moderation'],
        description: 'Setting for moderation module',
        required_permissions: [PermissionFlagsBits.Administrator],
    },
    async execute(context: CommandContext) {
        if (!context.message.member) return;
        if (!this.meta.required_permissions || !context.message.member.permissions.has(this.meta.required_permissions[0])) return;
    }
}