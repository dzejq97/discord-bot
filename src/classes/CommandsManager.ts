import MainClient from "src/main_client";
import { Prefixes } from "src/config.json";

import fs from 'node:fs';
import path, { dirname } from 'node:path';

import { Message, Collection } from 'discord.js';
import { ICommand } from "src/interfaces/ICommand";
import { IContext } from "src/interfaces/IContext";

export default class CommandsManager {
    client: MainClient;
    prefixes: string[];

    // Collection of categories contains collection of commands
    commands: Collection<string, Collection<string, ICommand>> = new Collection();
    constructor(client: MainClient) {
        this.client = client;
        this.prefixes = Prefixes;

        // Loading commands files
        const categoriesPath = path.join(__dirname, '/../commands');
        const categoriesFolders = fs.readdirSync(categoriesPath);
        for (const category of categoriesFolders) {
            const commandsPath = path.join(categoriesPath, category);
            const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
            // Format category name
            let categoryName = category.replace('_', ' ');
            categoryName = `${categoryName.charAt(0).toUpperCase()}${categoryName.substring(1)}`

            for ( const file of commandsFiles) {
                const filePath = path.join(commandsPath, file);
                const command: ICommand = require(filePath).command;
                command.meta.category = categoryName;
                this.commands.set(command.meta.category, new Collection<string, ICommand>().set(command.meta.name, command))
            }
        }
        console.log(this.commands);
    }

    // Seek for trigger of command in message content
    seekCommand(msg: Message) {
        
        // Ignore if command trigger message is DM or message author is bot
        if (!msg.guild || msg.author.bot) return;

        // Search all provided aliases
        let usedPrefix: string = "";
        for (const prefix of this.prefixes) {
            if (msg.content.startsWith(prefix)) usedPrefix = prefix;
        }
        // Stop if no alias detected
        if (usedPrefix === "") return;

        // Create command trigger context and assign used alias to it
        const context: IContext = {};
        context.used_prefix = usedPrefix;

        // Split command trigger message into arguments
        const commandArgs: string[] = msg.content.substring(usedPrefix.length).split(' ');
        const commandName = commandArgs.shift()?.toLowerCase();

        // Return if cant split message into arguments (maybe only prefix without command?)
        // TODO: Test it
        if(!commandName) return;



        this.commands.forEach(category => {
            category.forEach(command => {
                if (command.meta.name === commandName) {
                    // TODO: Execute command and insert context
                } else {
                    command.meta.aliases.forEach(alias => {
                        if (alias === commandName) {
                            // TODO: Execute command and insert context
                        }
                    })
                }

            })
        })
    }
}