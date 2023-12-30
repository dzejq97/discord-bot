import { EmbedBuilder } from 'discord.js';
import CustomClient from './CustomClient';
import { DefaultPrefix } from '../config.json';

export default class EmbedsManager {
    client: CustomClient;
    helpEmbeds: EmbedBuilder[] = [];

    constructor(client: CustomClient) {
        this.client = client;
        this.createHelpEmbeds();
    }

    createHelpEmbeds() {
        this.client.commands.commands.forEach( (commands, category) => {
            const emb = new EmbedBuilder();
            emb.setTitle(category);
            
            for (const command of commands.values()) {
                const title = '`' + DefaultPrefix + command.meta.name + '`';
                let desc = "";
                if (command.meta.description) desc += '**Description: **' + command.meta.description + '\n'
                if (command.meta.proper_usage) desc += '**Usage:** `' + command.meta.proper_usage + '`\n';
                if (command.meta.aliases) {
                    desc += '**Aliases:** '
                    for (const alias of command.meta.aliases) desc += '[`' + alias + '`] ';
                    desc += '\n\n\n';
                }

                emb.addFields({
                    name: title,
                    value: desc,
                });
            }
            this.helpEmbeds.push(emb);
        })
    }

    empty() {
        const emb = new EmbedBuilder();
        return emb;
    }

    info(content: string) {
        const embed = new EmbedBuilder({title: content});
        return embed;
    }
}