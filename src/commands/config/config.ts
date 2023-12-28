import CommandContext from "../../classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";
import { ICommand } from "../../interfaces/ICommand"

export const command: ICommand = {
    meta: {
        name: 'config',
        aliases: ['conf', 'cfg'],
        description: 'Main settings',
        proper_usage: '!config help',
        required_permissions: [PermissionFlagsBits.Administrator],
    },
    async execute(context: CommandContext) {
        if (!await context.canExecute()) return;

        if (!context.arguments || context.arguments.shift()?.content === 'help' ) {
            const emb = context.client.embeds.empty();
            emb.setTitle('Configuration help');

            emb.addFields({
                name: '!config cmd_channel_mode <value>',
                value: `
                Choose on which channels users can execute command.\n
                Accepted values: **WHITELIST**, **BLACKLIST**, **ANY** 
                `,
            });
            emb.addFields({
                name: '!config cmd_whitelist [add/remove/empty] <channel_mention>',
                value: `
                Add or remove channel from execution whitelist.
                `
            });
            emb.addFields({
                name: '!config cmd_blacklist [add/remove/empty] <channel_mention>',
                value: `
                Add or remove channel from execution blacklist.
                `
            });
            return;
        }

        if (context.arguments.shift()?.content === 'cmd_channel_mode')
    }
}