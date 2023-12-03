import { Prefixes } from "../config.json";
import CustomClient from "src/classes/CustomClient";

import fs from 'node:fs';
import path from 'node:path';

import { Message, Collection } from 'discord.js';
import { ICommand } from "src/interfaces/ICommand";
import CommandArgument from "./CommandArgument";
import CommandContext from "./CommandContext";

export default class CommandsManager {
    client: CustomClient;
    prefixes: string[];
    commands: Collection<string, Collection<string, ICommand>> = new Collection();

    constructor(client: CustomClient) {
        this.client = client
        this.prefixes = Prefixes;

        this.client.logger.info("Loading commands");
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
                this.commands.set(command.meta.category, new Collection<string, ICommand>().set(command.meta.name, command))
            }
            this.client.logger.success(`Loaded commands from ${category}`);
        }
        this.client.logger.success('All commands loaded.')
    } 

    hasPrefix(content: string) {
        for (const prefix of this.prefixes) {
            if (content.startsWith(prefix)) return true;
        }
        return false;
    }
    
    seekForCommand(msg: Message) {
        if (!msg.guild || msg.author.bot) return;
        
        const context = new CommandContext(this.client, this, msg);

        for (const prefix of this.prefixes) {
            if (msg.content.startsWith(prefix)) context.used_prefix = prefix;
        }
        if (!context.used_prefix) return;

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
                    command.execute(context);
                    return;
                } else {
                    command.meta.aliases?.forEach(alias => {
                        if (alias === commandName) {
                            context.used_alias = commandName;
                            command.execute(context);
                            return;
                        }
                    })
                }
            })
        })
        return;
    }

};