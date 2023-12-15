import { Events } from 'discord.js';
import { Message } from 'discord.js';
import MainClient from 'src/classes/CustomClient';
export = {
    name: Events.MessageCreate,
    once: false,

    async execute(client: MainClient, message: Message) {
        if (message.author.bot || !message.guild) return

        if (client.commands.hasPrefix(message.content)) {
            client.commands.seekForCommand(message);
            return;
        }

        //if (client.commands.seekForCommand(message)) return console.log('executed');
        //else console.log('not executed');
    }
};