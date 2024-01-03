import { Events, User } from 'discord.js';
import { Message } from 'discord.js';
import ms from 'ms';
import CustomClient from 'src/classes/CustomClient';
import guild from 'src/mongo/models/guild';

export = {
    name: Events.MessageCreate,
    once: false,

    async execute(client: CustomClient, message: Message) {
        /*  
        if (message.embeds && message.guild) {
            let bumper = message.mentions.repliedUser;

            if (bumper && message.embeds[0].data.title?.startsWith('Configuration help')) {
                console.log(`bumped by ${bumper.displayName}`);
            }
        }*/


        // Detect bump
        if (message.author.id === client.user?.id) return;
        if (message.embeds && message.author.bot && message.guild && message.embeds[0].data.description) {
            let bumper = message.mentions.repliedUser;
            console.log('bump#1')

            if (bumper && message.embeds[0].data.description.startsWith('Podbito serwer')) {
                console.log('bump#2')
                try {
                    await client.mongo.Member.findOneAndUpdate({
                        id: bumper.id,
                        guild_id: message.guild.id,
                    }, {
                        $inc: {bumps: 1},
                    });

                    const remind = new client.mongo.BumpRemind({
                        guild_id: message.guild.id,
                        last_bumper_id: bumper.id,
                        channel_id: message.channel.id
                    });

                    await remind.save();
                    
                    setTimeout(async () => client.bumpRemind(remind), ms('2h'));
                    console.log('bump#3');
                    return;
                } catch (err) {
                    return;
                }
            }
        }

        if (message.author.bot || !message.guild) return;

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
            await client.leveling.resolveExperience(message);
        } catch (error) {
            return client.logger.error(String(error));
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