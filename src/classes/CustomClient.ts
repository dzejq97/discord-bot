import { Client, TextChannel } from "discord.js";
import intents from "../dependencies/intents"
import fs from "node:fs";
import path from "node:path";

import CommandsManager from "./CommandsManager";
import Logger from "./Logger";
import EmbedsManager from "./EmbedsManager";
import LevelingManager from "./LevelingManager";
import CooldownManager from "./CooldownManager";
import MongoManager from "../mongo/MongoManager";
import CanvasManager from "./CanvasManager";
import { HydratedDocument } from "mongoose";
import { IBumpRemind } from "src/mongo/models/bump_remind";

export default class CustomClient extends Client {
    run_mode: 'dev' | 'debug' | 'deploy';
    commands: CommandsManager;
    logger: Logger = new Logger();
    embeds: EmbedsManager;
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
        this.embeds = new EmbedsManager(this);

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

    async bumpRemind(bumpRemind: HydratedDocument<IBumpRemind>) {
        const guild = await this.guilds.fetch(bumpRemind.guild_id);
        let channel = await guild.channels.cache.get(bumpRemind.channel_id) as TextChannel;
        if (!channel) {
            channel = await guild.channels.fetch(bumpRemind.channel_id) as TextChannel;
        }
        
        let lastBumper = await guild.members.fetch(bumpRemind.last_bumper_id);

        await this.mongo.BumpRemind.deleteMany({ guild_id: guild.id });
        await channel.send(`You can bump again this server!\nLast bumped by: ${lastBumper}`);
    }
}