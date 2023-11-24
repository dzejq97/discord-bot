import { Client } from 'discord.js';
import options from './dependencies/client_options';
import Logger from './classes/Logger';

export default class MainClient extends Client {
    constructor(){
        super(options);
        this.logger = new Logger();
    }
    commands_manager?: any; // Place for commands manager
    database_manager?: any; // Place for database manager
    logger: Logger; // Place for logger

}