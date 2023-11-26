import MainClient from "src/main_client";

import fs from 'node:fs';
import path, { dirname } from 'node:path';

import { Message, Collection } from 'discord.js';
import { ICommand } from "src/interfaces/ICommand";

export default class CommandsManager {
    client: MainClient;
    // Collection of categories contains collection of commands
    commands: Collection<string, Collection<string, ICommand>> = new Collection();
    constructor(client: MainClient) {
        this.client = client;
        
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

    seekCommand(msg: Message) {
        return;
    }
}