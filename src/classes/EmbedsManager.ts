import { EmbedBuilder } from 'discord.js';
import predefined_embeds from '../dependencies/predefined_embeds';

export default class EmbedsManager {

    info(content: string) {
        const embed = new EmbedBuilder({title: content});
        return embed;
    }

    credits() {
        return predefined_embeds.get('credits');
    }
}