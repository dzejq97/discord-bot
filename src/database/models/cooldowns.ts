import { Schema, model, Model, HydratedDocument, Types } from 'mongoose';
import UClient from 'src/classes/UClient';
import DatabaseManager from '../DatabaseManager';
import { Collection, Message } from 'discord.js';
import ms from 'ms';
import ICommand from 'src/interfaces/ICommand';

interface ICooldown {
    _id: Types.ObjectId,
    user_id: string,
    guild_id: string,
    name: string,
    start: number,
    time: number,
}

type CooldownModelType = Model<ICooldown>;

const schema = new Schema<ICooldown, CooldownModelType>({
    _id: { type: Schema.Types.ObjectId, required: true, default: new Types.ObjectId() },
    user_id: { type: String, required: true },
    guild_id: { type: String, required: true},
    name: { type: String, required: true },
    start: { type: Number, required: true },
    time: { type: Number, required: true }
});

export default class CooldownManager {
    private client: UClient;
    private database: DatabaseManager;
    CooldownModel: CooldownModelType = model<ICooldown, CooldownModelType>('Cooldown', schema);
    private active: Collection<string, HydratedDocument<ICooldown>> = new Collection();

    constructor(client: UClient) {
        this.client = client;
        this.database = client.database;
    }

    async check(message: Message, command: ICommand): Promise<boolean> {
        if (!message.guild) return false;
        let save: boolean;
        const document = this.active.find( doc => 
            doc.user_id === message.author.id &&
            doc.guild_id === message.guild?.id &&
            doc.name === command.meta.cooldown?.name);
        
        if (!document) {
            if (command.meta.cooldown) {
                if (command.meta.cooldown.database_save) save = true;
                else save = false;
                
                try {
                    await this.set({
                        raw: {
                            user_id: message.author.id,
                            guild_id: message.guild?.id,
                            name: command.meta.cooldown.name,
                            time: command.meta.cooldown.time,
                            database_save: save,
                        }
                    });
                } catch (err) {
                    this.client.log.error(err);
                }
                return true;
            }
        }
        else {
            if (command.meta.cooldown?.feedback_message) {
                const reply = await message.reply(`You can use this command again in ${ms(document.time - (Date.now() - document.start), {long: true})}`);
                if (command.meta.autodelete_reply_message) {
                    setTimeout(async () => await reply.delete(), ms('10s'));
                }
            }
            return false;
        }
        return true;
    } 

    async get(options: ICooldownOptions): Promise<HydratedDocument<ICooldown> | null> {
        let document: HydratedDocument<ICooldown> | null| undefined;
        if (options.raw) {
            document = this.active.find( doc => 
                doc.user_id === options.raw?.user_id &&
                doc.guild_id === options.raw.guild_id &&
                doc.name === options.raw.name);
        } else if (options.document) {
            document = this.active.find( doc => 
                doc.user_id === options.document?.user_id &&
                doc.guild_id === options.document.guild_id &&
                doc.name === options.document.name)
        }
        if (!document) return null;
        else return document;
    }

    async set(options: ICooldownOptions) {
        let doc: any, cooldown_time;
        if(options.document) {
            doc = options.document;
        } else if (options.raw) {
            if (!options.raw.time) throw new Error('time parameter is required in set() method');
            if (typeof options.raw.time === 'string') cooldown_time = ms(options.raw.time);
            else cooldown_time = options.raw.time;

            doc = new this.CooldownModel({
                user_id: options.raw.user_id,
                guild_id: options.raw.guild_id,
                name: options.raw.time,
                time: cooldown_time,
                start: Date.now()
            });
        } else {
            throw new Error('Invalid document passed');
        }

        try {
            if (options.raw && options.raw.database_save) {
                await doc.save();
            }

            this.active.set(doc.user_id, doc);
            setTimeout(async () => await this.clear({document: doc}));
        } catch (err) {
            this.client.log.error(err);
        }
    }

    async clear(options: ICooldownOptions) {
        let user_id: string, guild_id: string, name: string;
        if (options.document) {
            user_id = options.document.user_id;
            guild_id = options.document.guild_id;
            name = options.document.name;
        } else if (options.raw) {
            user_id = options.raw.user_id;
            guild_id = options.raw.guild_id;
            name = options.raw.name;
        } else {
            throw new Error('Invalid document passed');
        }

        const document = this.active.find( doc =>
            doc.user_id === user_id &&
            doc.guild_id === guild_id &&
            doc.name === name
        );
        if (!document) return;

        const key = this.active.findKey( doc => {
            doc.user_id === user_id &&
            doc.guild_id === guild_id &&
            doc.name === name
        });

        if (!key) return;
        
        try {
            await this.CooldownModel.findOneAndDelete({ _id: document._id });
            this.active.delete(key)
        } catch (err) {
            this.client.log.error(err);
        }
    }

    async load() {
        const cooldowns = await this.CooldownModel.find();

        for(const cooldown of cooldowns.values()) {
            if(cooldown.start + cooldown.time <= Date.now()) {
                await this.CooldownModel.findOneAndDelete({ _id: cooldown._id });
                continue;
            } else {
                this.set({document: cooldown});
                continue;
            }
        }
    }
}

interface ICooldownOptions {
    raw?: {
        user_id: string,
        guild_id: string,
        name: string,
        time?: string | number,
        database_save?: boolean
    },
    document?: HydratedDocument<ICooldown>,
}