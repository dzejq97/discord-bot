import { Client } from "discord.js";
import intents from "../dependencies/intents"
import fs from "node:fs";
import path from "node:path";

import CommandsManager from "./CommandsManager";
import Logger from "./Logger";
import EmbedsManager from "./EmbedsManager";

export default class CustomClient extends Client {
    commands: CommandsManager;
    logger: Logger = new Logger();
    embeds: EmbedsManager = new EmbedsManager();
    constructor() {
        super(intents);

        this.commands = new CommandsManager(this);
    }

    async init() {
        this.logger.info('Loading events:')
        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
        for (const file of eventFiles) {
            this.logger.info(`Loading: ${file}`)
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            } else {
                this.on(event.name, (...args) => event.execute(this, ...args));
            }
            this.logger.success(`${file} loaded`)
        }
    }
}