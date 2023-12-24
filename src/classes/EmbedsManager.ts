import { EmbedBuilder } from 'discord.js';
import predefined_embeds from '../dependencies/predefined_embeds';

export default class EmbedsManager {
    empty() {
        const emb = new EmbedBuilder();
        return emb;
    }

    info(content: string) {
        const embed = new EmbedBuilder({title: content});
        return embed;
    }

    credits() {
        return predefined_embeds.get('credits');
    }
}