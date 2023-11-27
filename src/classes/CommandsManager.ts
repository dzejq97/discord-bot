import MainClient from "../main_client";
import { Prefixes } from "../config.json";

import fs from 'node:fs';
import path, { dirname } from 'node:path';

import { Message, Collection } from 'discord.js';
import { ICommand } from "src/interfaces/ICommand";
import { IContext } from "src/interfaces/IContext";

export default class CommandsManager {
    client: MainClient;
    prefixes: string[];

    // Collection of categories contains collection of commands_categories
    commands_categories: Collection<string, Collection<string, ICommand>> = new Collection();
    constructor(client: MainClient) {
        this.client = client;
        this.prefixes = Prefixes;

        this.client.logger.info("Loading commands")
        const categoriesPath = path.join(__dirname, '/../commands');
        const categoriesFolders = fs.readdirSync(categoriesPath);
        for (const category of categoriesFolders) {
            this.client.logger.info(`Loading commands from ${category}:`);
            const commandsPath = path.join(categoriesPath, category);
            const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
            // Format category name
            let categoryName = category.replace('_', ' ');
            categoryName = `${categoryName.charAt(0).toUpperCase()}${categoryName.substring(1)}`

            for ( const file of commandsFiles) {
                this.client.logger.info(`Loading ${file} command.`)
                const filePath = path.join(commandsPath, file);
                const command: ICommand = require(filePath).command;
                command.meta.category = categoryName;
                this.commands_categories.set(command.meta.category, new Collection<string, ICommand>().set(command.meta.name, command))
            }
        this.client.logger.success(`Loaded commands from ${category}`);
        }
        this.client.logger.success('All commands loaded.')
    }

    // Seek for trigger of command in message content
    seekCommand(msg: Message) {
        if (!msg.guild || msg.author.bot) return;

        let usedPrefix: string = "";
        for (const prefix of this.prefixes) {
            if (msg.content.startsWith(prefix)) usedPrefix = prefix;
        }
        if (usedPrefix === "") return;

        const context: IContext = {};
        context.used_prefix = usedPrefix;
        context.message = msg;
        context.client = this.client;

        const commandArgs: string[] = msg.content.substring(usedPrefix.length).split(' ');
        const commandName = commandArgs.shift()?.toLowerCase();

        if(!commandName) return;

        this.commands_categories.forEach(category => {
            category.forEach(command => {
                if (command.meta.name === commandName) {
                    context.used_alias = commandName;
                    command.execute(context);
                    return;
                } else {
                    command.meta.aliases.forEach(alias => {
                        if (alias === commandName) {
                            context.used_alias = commandName;
                            command.execute(context);
                            return;
                        }
                    })
                }

            })
        })
    }
}