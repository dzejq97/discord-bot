import { Client } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

import intents from './dependencies/intents';

import Logger from './classes/Logger';
import CommandsManager from './classes/CommandsManager';
import EmbedsManager from './classes/EmbedsManager';



export default class MainClient extends Client {
    logger: Logger = new Logger();
    embeds: EmbedsManager = new EmbedsManager();
    commands_manager: CommandsManager;


    constructor(){
        super(intents);

        this.commands_manager = new CommandsManager(this);
    }
    database_manager?: any; // Place for database manager

    loadEvents() {
        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            } else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}