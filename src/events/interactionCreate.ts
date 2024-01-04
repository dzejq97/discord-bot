import { Events, Interaction } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';


export = {
    name: Events.MessageCreate,
    once: false,

    async execute(client: CustomClient, interaction: Interaction) {
    }
}