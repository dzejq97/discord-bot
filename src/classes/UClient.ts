import { Client, ClientEvents, Collection, Events } from "discord.js";
import options from "../client_options";
import * as config from "../config.json";

import fs from 'node:fs';
import path from 'node:path';
import CommandsManager from "./CommandsManager";
import { Logger } from './Logger';
import DatabaseManager from "src/database/DatabaseManager";

export default class UClient extends Client{
    config = config;
    verbose: boolean = false;
    modules: Collection<string, any> = new Collection();
    forbidden_events: any[] = []
    commands: CommandsManager;
    log: Logger = require('./Logger');
    database: DatabaseManager;

    constructor() {
        super(options);
        if (process.argv.find(v => v === '-v')) this.verbose = true;

        this.commands = new CommandsManager(this);
        this.database = new DatabaseManager(this);
        this.log.client = this;

    }

    async run() {
        try {
            await this.load();
            await this.commands.load();
        } catch (err) {
            this.log.error(err, true);
        } finally {
            try {
                //await this.login(process.env.TOKEN);
            } catch (err) {
                this.log.error(err, true);
            }
        }
    }
    
    private async load() {
        // Load single listener events
        this.log.info('Loading global events...');
        const eventsPath = path.join(__dirname, '../global_events');
        const eventsDir = fs.readdirSync(eventsPath);
        for (const file of eventsDir.filter(v => v.endsWith('.js'))) {
            const event = require(path.join(eventsPath, file));
            if (event.once) {
                this.once(event.name, async (...args) => await event.execute(this, ...args));
            } else {
                this.on(event.name, async (...args) => await event.execute(this, ...args));
            }

            if (event.restricted)
                this.forbidden_events.push(event.name);
            this.log.info(`Loaded event from ${file}`);
        }
        this.log.success('Global events loaded');

        // Load modules
        this.log.info('Loading modules...');
        const modulesPath = path.join(__dirname, '../modules');
        const modulesDirs = fs.readdirSync(modulesPath);
        for (const moduleDir of modulesDirs) {
            this.log.info(`Loading module from ${moduleDir}`);
            const moduleFilePath = path.join(modulesPath, moduleDir, 'module.js');
            const module = require(moduleFilePath);
            this.modules.set(module.meta.name, module);
            await module.load(this);
        }
        this.log.success('Modules loaded')
    }

    
}