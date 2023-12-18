import { Events } from 'discord.js';
import { Message } from 'discord.js';
import MainClient from 'src/classes/CustomClient';
export = {
    name: Events.MessageCreate,
    once: false,

    async execute(client: MainClient, message: Message) {
        if (message.author.bot || !message.guild) return;

        // Check if message is executing command
        if (client.commands.hasPrefix(message.content)) {
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
                client.cooldowns.setCooldown(message.author.id, "TO_reputation", "30m");

                try {
                    if (first_char === '+') {
                        await client.prisma.user.update({
                            where: { id: target.id}, 
                            data: { reputation: { increment: 1 }}
                        });
                        return;
                    } else if (first_char === '-') {
                        await client.prisma.user.update({
                            where: { id: target.id },
                            data: { reputation: { decrement: 1 }}
                        });
                        return;
                    }
                } catch (error) {
                    return client.logger.error(String(error));
                }
        }
    }
};