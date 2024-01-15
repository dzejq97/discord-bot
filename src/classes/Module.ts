import { Collection, Events } from "discord.js";
import UClient from "./UClient";
import fs from 'node:fs';
import path from 'node:path'
import ICommand from "src/interfaces/ICommand";
import IEvent from "src/interfaces/IEvent";

interface IModuleMeta {
    moduleDir: string,
    name: string;
    description: string;
    toggleable: boolean,
}



export default class Module {
    private client: UClient | undefined;
    meta: IModuleMeta | undefined;
    commands: Collection<string, ICommand> = new Collection();

    async load(client: UClient): Promise<void> {
        if (!this.meta) throw new Error('Module meta is undefined');
        if (!client) throw new Error('No client instance passed to load() method');
        this.client = client;
        if (!this.meta) throw new Error('No meta data defined in module')

        const modulePath = path.join(__dirname, '..', this.meta.moduleDir);
        const moduleContent = fs.readdirSync(modulePath);
        
        if (moduleContent.find(v => v === 'events')) {
            client.log.info(`Loading events of ${this.meta.name} module`);
            const eventsDir = path.join(modulePath, 'events');
            const eventsFiles = fs.readdirSync(eventsDir);
            for (const file of eventsFiles.filter(v => v.endsWith('.js'))) {
                const event: IEvent = require(path.join(eventsDir, file));
                if (client.forbidden_events.find(v => v === event.name)) {
                    throw new Error (`Cannot use ${event.name} in module events. Use defined in global_events instead`);
                }
                event.module = this;
                if (event.once) {
                    client.once(event.name, async (...args) => await event.execute(client, ...args));
                } else {
                    client.on(event.name, async (...args) => await event.execute(client, ...args));
                }
                client.log.info(`Loaded ${file} event`);
            }
            client.log.info(`Loaded ${this.meta.name} module events`);
        }
        if (moduleContent.find(v => v === 'commands')) {
            client.log.info(`Loading commands of ${this.meta.name} module`);
            const commandsDir = path.join(modulePath, 'commands');
            const commandsFiles = fs.readdirSync(commandsDir);
            for (const file of commandsFiles.filter(v => v.endsWith('.js'))) {
                const command: ICommand = require(path.join(commandsDir, file));
                command.module = this;
                if (!command.meta) throw new Error(`Undefined meta in ${file}`);
                this.commands.set(command.meta.name, command);
                client.log.info(`Loaded ${command.meta.name} command.`)
            }
            client.log.info(`Loaded ${this.meta.name} commands`)
        }
        client.log.success(`Loaded ${this.meta.name} module`);
    }
}