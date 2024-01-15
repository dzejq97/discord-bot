import ICommand from "src/interfaces/ICommand";
import UClient from "./UClient";
import { Collection, Message } from "discord.js";
import ms from "ms";
import CommandContext from "./CommandContext";

export default class CommandsManager {
    private client: UClient;
    private list: Collection<string, ICommand> = new Collection
    constructor(client: UClient) {
        this.client = client;
    }

    async load() {
        this.client.log.info(`Indexing commands`);
        const str_cache: string[] = [];
        for (const module of this.client.modules.values()) {
            const commands: ICommand[] = module.commands.values();
            for (const command of commands) {
                if (str_cache.find(v => v === command.meta.name)) {
                    throw new Error(`Command ${command.meta.name} of module ${module.meta.name} or its aliases exists in global scope`);
                } else {
                    str_cache.push(command.meta.name);
                }

                if (command.meta.aliases) {
                    for (const alias of command.meta.aliases) {
                        if (str_cache.find(v => v === alias)) {
                            throw new Error(`Command ${command.meta.name} of module ${module.meta.name} or its aliases exists in global scope`);
                        } else {
                            str_cache.push(alias);
                        }
                    }
                }

                command.module = module;
                this.list.set(command.meta.name, command);
                this.client.log.info(`Indexed ${command.meta.name}`);
            }
        }
        this.client.log.success(`All commands indexed`)
    }

    async seek(msg: Message): Promise<boolean> {
        // Get guild prefix here later
        const prefix = this.client.config.default_prefix;

        // Check if message starts with prefix
        if (!msg.content.startsWith(prefix)) return false;

        // Create context and assign used prefix
        const context = new CommandContext(this.client, msg);
        context.used_prefix = prefix;

        // Split message into array and pick command name
        const args = msg.content.substring(prefix.length).split(' ');
        const commandName = args.shift()?.toLowerCase();
        context.args = args;

        // Search commands list and execute
        this.list.forEach(async (command) => {
            if (command.meta.name === commandName) {
                context.used_alias = commandName;
                context.command = command;
                if (await this.verifyRequirements(msg, command)) {
                    if (command.meta.autodelete_trigger_message)
                        await msg.delete();
                    await command.execute(context);
                    return true;
                } else {
                    return false;
                }
            } else {
                command.meta.aliases?.forEach(async (alias) => {
                    if (alias === commandName) {
                        context.used_alias = commandName;
                        context.command = command;
                        if (await this.verifyRequirements(msg, command)) {
                            if (command.meta.autodelete_trigger_message)
                                await msg.delete();
                            await command.execute(context);
                            return true;
                        } else {
                            return false;
                        }
                    }
                })
            }
        })
        return false;
    }

    async verifyRequirements(msg: Message, command: ICommand): Promise<boolean> {
        return true;
    }
}