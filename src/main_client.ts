import { Client } from 'discord.js';
import intents from './dependencies/intents';
import Logger from './classes/Logger';

export default class MainClient extends Client {
    logger: Logger = new Logger();

    constructor(){
        super(intents);
    }
    commands_manager?: any; // Place for commands manager
    database_manager?: any; // Place for database manager

}