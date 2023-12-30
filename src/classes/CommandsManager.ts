import CustomClient from "./CustomClient";

import fs from 'node:fs';
import path from 'node:path';

import { Message, Collection, Guild } from 'discord.js';
import { ICommand } from "src/interfaces/ICommand";
import CommandArgument from "./CommandArgument";
import CommandContext from "./CommandContext";

export default class CommandsManager {
    client: CustomClient;
    commands: Collection<string, Collection<string, ICommand>> = new Collection();

    constructor(client: CustomClient) {
        this.client = client

        const categoriesPath = path.join(__dirname, '/../commands');
        const categoriesFolders = fs.readdirSync(categoriesPath);
        for (const category of categoriesFolders) {
            const commandsPath = path.join(categoriesPath, category);
            const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            // Format category name
            let categoryName = category.replace('_', ' ');
            categoryName = `${categoryName.charAt(0).toUpperCase()}${categoryName.substring(1)}`;
            if (!this.commands.get(categoryName)) this.commands.set(categoryName, new Collection<string, ICommand>());

            for ( const file of commandsFiles) {
                const filePath = path.join(commandsPath, file);
                const command: ICommand = require(filePath).command;
                command.meta.category = categoryName;
                this.commands.get(command.meta.category)?.set(command.meta.name, command);
            }
        }
        this.client.logger.success('Commands loaded.')
    } 

    hasPrefix(content: string, guild: Guild): boolean {
        const prefix = this.client.mongo.guilds_settings.get(guild.id)?.prefix;
        if (!prefix) return false

        if (content.startsWith(prefix)) return true;
        return false;
    }
    
    seekForCommand(msg: Message) {
        if (!msg.guild || msg.author.bot) return;
        const context = new CommandContext(this.client, msg);

        const prefix = this.client.mongo.guilds_settings.get(msg.guild.id)?.prefix;
        if (!prefix) return;
        context.used_prefix = prefix;

        const commandArgs: string[] = msg.content.substring(context.used_prefix.length).split(' ');
        const commandName = commandArgs.shift()?.toLowerCase();
        if (!commandName) return;

        if (commandArgs.length > 0) {
            context.arguments = [];
            for (const arg of commandArgs) context.arguments.push(new CommandArgument(arg, this.client, msg));
        }

        this.commands.forEach(category => {
            category.forEach(command => {
                if (command.meta.name === commandName) {
                    context.used_alias = commandName;
                    context.command = command;
                    command.execute(context);
                    return;
                } else {
                    command.meta.aliases?.forEach(alias => {
                        if (alias === commandName) {
                            context.used_alias = commandName;
                            context.command = command;
                            command.execute(context);
                            return;
                        }
                    })
                }
            })
        })
    }

};