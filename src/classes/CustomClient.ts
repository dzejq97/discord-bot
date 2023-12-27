import { Client } from "discord.js";
import intents from "../dependencies/intents"
import fs from "node:fs";
import path from "node:path";
import * as mongoose from "mongoose";

import CommandsManager from "./CommandsManager";
import Logger from "./Logger";
import EmbedsManager from "./EmbedsManager";
import LevelingManager from "./LevelingManager";
import CooldownManager from "./CooldownManager";
import MongoManager from "../mongo/MongoManager";
import CanvasManager from "./CanvasManager";

export default class CustomClient extends Client {
    run_mode: 'dev' | 'debug' | 'deploy';
    commands: CommandsManager;
    logger: Logger = new Logger();
    embeds: EmbedsManager = new EmbedsManager();
    leveling: LevelingManager;
    cooldowns: CooldownManager;
    canvas: CanvasManager;
    mongo: MongoManager;

    constructor() {
        super(intents);

        const mode = process.argv[2];
        if (mode === 'dev') this.run_mode = mode;
        else if (mode === 'debug') this.run_mode = mode;
        else if (mode === 'deploy') this.run_mode = mode;
        else this.run_mode = 'deploy';

        this.mongo = new MongoManager(this);
        this.logger.info(`Starting in ${this.run_mode.toUpperCase()} mode.`);
        this.commands = new CommandsManager(this);
        this.leveling = new LevelingManager(this);
        this.cooldowns = new CooldownManager(this);
        this.canvas = new CanvasManager(this);

        this.init();
    }

    async init() {        
        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            } else {
                this.on(event.name, (...args) => event.execute(this, ...args));
            }
        }
        this.logger.success(`Events loaded`)

    }
}