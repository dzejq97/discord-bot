import { Client } from 'discord.js';
import intents from './dependencies/intents';

import Logger from './classes/Logger';
import CommandsManager from './classes/CommandsManager';

export default class MainClient extends Client {
    logger: Logger = new Logger();
    commands_manager: CommandsManager;

    constructor(){
        super(intents);

        this.commands_manager = new CommandsManager(this);
    }
    database_manager?: any; // Place for database manager

}