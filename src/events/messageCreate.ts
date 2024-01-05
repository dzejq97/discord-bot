import { Events, TextChannel, User } from 'discord.js';
import { Message } from 'discord.js';
import ms from 'ms';
import CustomClient from 'src/classes/CustomClient';
import { XpPerMessage } from "../config.json"

export = {
    name: Events.MessageCreate,
    once: false,

    async execute(client: CustomClient, message: Message) {
        // Bump detection
        if (message.interaction?.type === 2 && message.guild) {
            if (message.embeds[0].data) {
                if (message.embeds[0].description?.startsWith('Podbito')) {
                    const bumper = message.interaction.user;
                    const guild = message.guild;
                    try {
                        await client.mongo.Member.findOneAndUpdate({
                            id: bumper.id,
                            guild_id: guild.id,
                        }, {
                            $inc: { bumps: 1 }
                        });
                        
                        const remind = new client.mongo.BumpRemind({
                            guild_id: guild.id,
                            last_bumper_id: bumper.id,
                            channel_id: message.channel.id,
                        });

                        await remind.save();

                        setTimeout(async () => client.bumpRemind(remind), ms('2h'));
                        await message.reply(`Bumped by ${bumper}`);
                        return;
                    } catch (err) {
                        return;
                    }
                }
            }
        }

        if (message.author.bot || !message.guild || !message.member) return;

        // Check if message is executing command
        if (client.commands.hasPrefix(message.content, message.guild)) {
            const g_settings = client.mongo.guilds_settings.get(message.guild.id);
            if (g_settings?.cmd_channel_mode === 'blacklist') {
                if (g_settings.cmd_channel_blacklist.find(id => id === message.channel.id)) return;
            } else if (g_settings?.cmd_channel_mode === 'whitelist') {
                if (!g_settings.cmd_channel_whitelist.find(id => id === message.channel.id)) return;
            }

            client.commands.seekForCommand(message);
            return;
        }
        // Add user experience and calculate level up
        try {
            await client.leveling.giveExperience(message.member, XpPerMessage, message.channel as TextChannel)
        } catch (err) {
            return client.logger.error(String(err));
        }

        // Check if message is giving someone rep
        if (message.content.startsWith('+rep') ||
            message.content.startsWith('-rep') ||
            message.content.startsWith('+1') || 
            message.content.startsWith('-1')) {
                if (client.cooldowns.active.find(c=> c.name === "TO_reputation")) return;
                const first_char = message.content.charAt(0);
                let target: any = message.mentions.repliedUser;
                if (!target) {
                    target = message.mentions.members?.first();
                    if (!target) return;
                }
                client.cooldowns.set(message.author.id, "TO_reputation", "30m", false);

                try {
                    if (first_char === '+') {
                        await client.mongo.Member.findOneAndUpdate({ id: target.id }, { $inc: { reputation: 1}});
                        return;
                    } else if (first_char === '-') {
                        await client.mongo.Member.findOneAndUpdate({id: target.id }, { $inc: { reputation: -1}})
                        return;
                    }
                } catch (error) {
                    return client.logger.error(String(error));
                }
        
        }
    }
};