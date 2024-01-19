import { Collection } from "discord.js";
import UClient from "./UClient";
import fs from 'node:fs';
import path from 'node:path'
import ICommand from "src/interfaces/ICommand";
import IEvent from "src/interfaces/IEvent";
import IModuleMeta from "src/interfaces/IModuleMeta";
import { HydratedGuild} from "src/database/models/guilds";

export default class Module {
    client: UClient | undefined;
    meta: IModuleMeta | undefined;
    commands: Collection<string, ICommand> = new Collection();
    default_config: any;

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
                //Look for subcommands
                const subcommandsDirName = file.substring(0, file.length - 3);
                if (commandsFiles.find(v => v === subcommandsDirName)) {
                    client.log.info(`Loading subcommands of ${command.meta.name}`);
                    const subcommandsDir = path.join(commandsDir, subcommandsDirName);
                    const subcommandsFiles = fs.readdirSync(subcommandsDir);
                    for (const subcommandFile of subcommandsFiles.filter(v => v.endsWith('.js'))) {
                        const subcommand: ICommand = require(path.join(subcommandsDir, subcommandFile));
                        if (!command.subcommands) command.subcommands = [];
                        command.subcommands.push(subcommand);
                        subcommand.parent_command = command;
                        client.log.info(`Loaded subcommand ${subcommand.meta.name} of ${command.meta.name}`);
                    }
                }
                if (!command.meta) throw new Error(`Undefined meta in ${file}`);
                this.commands.set(command.meta.name, command);
                client.log.info(`Loaded ${command.meta.name} command.`);
            }
            client.log.info(`Loaded ${this.meta.name} commands`)
        }

        ////////////////////////
        /*
        client.log.info(`Loading and synchronizing module config`);
        if (this.config) {
            const oaGuilds = await this.client.guilds.fetch();
            for (const oaGuild of oaGuilds.values()) {
                const doc: HydratedGuild | null = await this.client.database.guilds.get(oaGuild.id);
                if (!doc) throw new Error('Failed syncing module config. No guild document in database.');

                if (!doc.modules_config.has(this.meta.name)) {
                    doc.modules_config.set(this.meta.name, this.config);
                    await doc.update(this.client.database);
                }
            }
        }*/
        //////////////////////
        client.log.success(`Loaded ${this.meta.name} module`);
    }
}