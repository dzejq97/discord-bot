import MainClient from "src/main_client";

import fs from 'node:fs';
import path, { dirname } from 'node:path';

import { Message, Collection } from 'discord.js';
import { ICommand } from "src/interfaces/ICommand";

export default class CommandsManager {
    client: MainClient;
    // Collection of categories contains collection of commands
    commands: Collection<string, Collection<string, ICommand>> | null = null;
    constructor(client: MainClient) {
        this.client = client;
        
        // Loading commands files
        const categoriesPath = path.join(__dirname, '/../commands');
        const categoriesFolders = fs.readdirSync(categoriesPath);
        for (const category of categoriesPath) {
            const commandsPath = path.join(categoriesPath, category);
            const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
            category.replace('_', ' ');
            const categoryName = category.charAt(0).toUpperCase().slice(1)
            for ( const file of commandsFiles) {
                const command = require(file);
            }
        }
    }

    seekCommand(msg: Message) {
        return;
    }
}