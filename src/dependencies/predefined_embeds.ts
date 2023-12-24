import { Collection, EmbedBuilder } from "discord.js";

const predefined_embeds = new Collection();

const credits = new EmbedBuilder()
    .setTitle('title')
    .setColor(0x0099FF)
    .setAuthor({name: "Dawid Niedziółka @ SZajbuS"})
    .setFooter({text: "Created with <3"})
predefined_embeds.set('credits', credits);

export default predefined_embeds;