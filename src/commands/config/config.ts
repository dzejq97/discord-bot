import CommandContext from "../../classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";
import { ICommand } from "../../interfaces/ICommand"
import ms from "ms";
import guild from "src/mongo/models/guild";

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
                name: '!config cmd_whitelist [add/remove/empty] <channel_mention/channel_id or index when remove>',
                value: `
                Add or remove channel from execution whitelist.
                `
            });
            emb.addFields({
                name: '!config cmd_blacklist [add/remove/empty] <channel_mention/channel_id or index when remove>',
                value: `
                Add or remove channel from execution blacklist.
                `
            });
            await context.message.reply({embeds: [emb]});
            return;
        }

        if (context.arguments.shift()?.content.toLowerCase() === 'cmd_channel_mode') {
            try {
                const value = context.arguments.shift()?.content.toLowerCase();
                const guild = await context.mongo.Guild.findOne({ id: context.guild?.id });

                if (!guild) throw new Error('No guild in database');

                if (value === 'whitelist') guild.settings.cmd_channel_mode = 'whitelist';
                else if (value === 'blacklist') guild.settings.cmd_channel_mode = 'blacklist';
                else if (value === 'any') guild.settings.cmd_channel_mode = 'any';
                else {
                    await context.reply('Unaccepted value given.\nUse !config cmd_channel_mode [whitelist/blacklist/any] or look into !config help')
                    return;
                }

                await guild.save();
                await context.reply(`Bot execution channel mode set to **${value}**`)
                return;
            } catch (error) {
                context.client.logger.error(String(error));
                return;
            }
        } else if (context.arguments.shift()?.content.toLowerCase() === 'cmd_whitelist') {
            try {
                const mode = context.arguments.shift()?.content.toLowerCase();
                const guild = await context.mongo.Guild.findOne({ id: context.guild?.id });
                const channel = await context.arguments.shift();

                if (!guild) {
                    throw new Error('No guild in database')
                }
                if (!mode) {
                    let str = "";
                    for (let i in guild.settings.cmd_channel_whitelist) {
                        let ch = await context.guild?.channels.fetch(guild.settings.cmd_channel_whitelist[i]);
                        let ch_name: string;
                        if (!ch) ch_name = guild.settings.cmd_channel_whitelist[i] + '*deleted from guild*';
                        else ch_name = ch.name;

                        str += '**' + i + '**: ' + ch_name + '\n';
                    }
                    const emb = context.client.embeds.empty();
                    emb.setTitle('Commands execution whitelist:');
                    emb.setDescription(str);
                    const reply = await context.message.reply({embeds: [emb]});
                    setTimeout(async () => await reply.delete(), ms('10s'));
                    setTimeout(async () => await context.message.delete(), ms('10s'));
                    return;
                }
                if (!channel) {
                    await context.reply('Must provide channel id or mention');
                    return;
                }

                if (mode === 'add') {
                    let ch = await channel?.parseToChannel();
                    if (!ch) ch = await context.guild?.channels.fetch(channel?.content);
                    if (!ch) {
                        await context.reply('Must provide correct channel id or mention.');
                        return;
                    }

                    guild.settings.cmd_channel_whitelist.push(ch.id);
                } else if (mode === 'remove') {
                    let index = parseInt(channel.content);
                    if (!index)
                        return await context.reply('Must provide correct index. Check current whitelist by `!config cmd_whitelist`');
                    if (index + 1 > guild.settings.cmd_channel_whitelist.length)
                        return await context.reply('No such index in whitelist.');

                    await context.reply(`Removed channel ${guild.settings.cmd_channel_whitelist[index]} from whitelist`);
                    delete guild.settings.cmd_channel_whitelist[index];
                    await guild.save();
                    return;
                } else if (mode === 'empty') {
                    guild.settings.cmd_channel_whitelist = [];
                    await context.reply('Whitelist cleared.');
                    await guild.save();
                    return;
                }

            } catch (error) {
                context.client.logger.error(String(error));
                return;
            }
        } else if (context.arguments.shift()?.content.toLowerCase() === 'cmd_blacklist') {
            try {
                const mode = context.arguments.shift()?.content.toLowerCase();
                const guild = await context.mongo.Guild.findOne({ id: context.guild?.id });
                const channel = await context.arguments.shift();

                if (!guild) {
                    throw new Error('No guild in database')
                }
                if (!mode) {
                    let str = "";
                    for (let i in guild.settings.cmd_channel_blacklist) {
                        let ch = await context.guild?.channels.fetch(guild.settings.cmd_channel_blacklist[i]);
                        let ch_name: string;
                        if (!ch) ch_name = guild.settings.cmd_channel_blacklist[i] + '*deleted from guild*';
                        else ch_name = ch.name;

                        str += '**' + i + '**: ' + ch_name + '\n';
                    }
                    const emb = context.client.embeds.empty();
                    emb.setTitle('Commands execution blacklist:');
                    emb.setDescription(str);
                    const reply = await context.message.reply({embeds: [emb]});
                    setTimeout(async () => await reply.delete(), ms('10s'));
                    setTimeout(async () => await context.message.delete(), ms('10s'));
                    return;
                }
                if (!channel) {
                    await context.reply('Must provide channel id or mention');
                    return;
                }

                if (mode === 'add') {
                    let ch = await channel?.parseToChannel();
                    if (!ch) ch = await context.guild?.channels.fetch(channel?.content);
                    if (!ch) {
                        await context.reply('Must provide correct channel id or mention.');
                        return;
                    }

                    guild.settings.cmd_channel_blacklist.push(ch.id);
                } else if (mode === 'remove') {
                    let index = parseInt(channel.content);
                    if (!index)
                        return await context.reply('Must provide correct index. Check current blacklist by `!config cmd_blacklist`');
                    if (index + 1 > guild.settings.cmd_channel_blacklist.length)
                        return await context.reply('No such index in blacklist.');

                    await context.reply(`Removed channel ${guild.settings.cmd_channel_blacklist[index]} from whitelist`);
                    delete guild.settings.cmd_channel_blacklist[index];
                    await guild.save();
                    return;
                } else if (mode === 'empty') {
                    guild.settings.cmd_channel_blacklist = [];
                    await context.reply('Blacklist cleared.');
                    await guild.save();
                    return;
                }

            } catch (error) {
                context.client.logger.error(String(error));
                return;
            }
        }
    }
}