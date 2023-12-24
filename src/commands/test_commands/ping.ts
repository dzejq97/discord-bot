import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export const command: ICommand = {
    meta: {
        name: 'ping',
        aliases: ['pong'],
        description: 'Replies with Pong!',
        cooldown: {
            name: 'CMD_ping',
            time: '30s',
            feedback_message: true,
        },
        required_permissions: [PermissionFlagsBits.Administrator]
    },
    async execute(context: CommandContext) {
        //if (await context.cooldown(this, this.meta.cooldown?.feedback_message)) return;
        if (!context.verifyAuthorPermissions(this.meta.required_permissions)) return;

        if (context.used_alias === 'ping') context.message.reply('pong');
        else context.message.reply('ping');
    }
}