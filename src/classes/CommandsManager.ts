import MainClient from "../main_client";
import { Prefixes } from "../config.json";

import fs from 'node:fs';
import path from 'node:path';

import { Message, Collection } from 'discord.js';
import { ICommand, IContext } from "src/interfaces/ICommand";
import ComandArgument from "./CommandArgument";

export default class CommandsManager {
    client: MainClient;
    prefixes: string[];
    commands: Collection<string, Collection<string, ICommand>> = new Collection();

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
                this.commands.set(command.meta.category, new Collection<string, ICommand>().set(command.meta.name, command))
            }
            this.client.logger.success(`Loaded commands from ${category}`);
        }
        this.client.logger.success('All commands loaded.')
    }

    // Seek for trigger of command in message content
    seekCommand(msg: Message): boolean {
        if (!msg.guild || msg.author.bot) return false;

        let usedPrefix: string = "";
        for (const prefix of this.prefixes) {
            if (msg.content.startsWith(prefix)) usedPrefix = prefix;
        }
        if (usedPrefix === "") return false;

        const context: IContext = {client: this.client, commands_manager: this, message: msg};
        context.used_prefix = usedPrefix;
        context.message = msg;
        context.arguments = new Array();

        const commandArgs: string[] = msg.content.substring(usedPrefix.length).split(' ');
        const commandName = commandArgs.shift()?.toLowerCase();

        if (commandArgs.length > 0) {
            for (const arg of commandArgs) context.arguments.push(new ComandArgument(arg, this.client, msg));
        }
        else context.arguments = null;

        if(!commandName) return false;

        this.commands.forEach(category => {
            category.forEach(command => {
                if (command.meta.name === commandName) {
                    context.used_alias = commandName;
                    command.execute(context);
                    return true;
                } else {
                    command.meta.aliases?.forEach(alias => {
                        if (alias === commandName) {
                            context.used_alias = commandName;
                            command.execute(context);
                            return true;
                        }
                    })
                }

            })
        })
        return false;
    }

    argumentIsMemberMention(arg: string): boolean {
        if (arg.startsWith('<@') && arg.endsWith(">")) return true;
        return false;
    }

    argumentIsChannelMention(arg: string): boolean {
        if (arg.startsWith("<#") && arg.endsWith(">")) return true;
        return false;
    }
}