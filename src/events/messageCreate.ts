import { Events } from 'discord.js';
import { Message } from 'discord.js';
import client from '../index';

export = {
    name: Events.MessageCreate,
    once: false,

    async execute(message: Message) {
        if (client.commands_manager.seekCommand(message)) return;
    }
};