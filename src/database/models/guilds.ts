import { Schema, model, Types, Model, HydratedDocument, Document} from 'mongoose';
import { default_prefix } from '../../config.json'
import UClient from 'src/classes/UClient';
import { Collection, Guild, GuildMember } from 'discord.js';
import DatabaseManager from '../DatabaseManager';
import { HydratedMember } from './members';

interface IGuild {
    //Instance params
    client: UClient,
    //Schema params
    id: string,
    join_at: Date,
    owner_id: string,
    members: Types.ObjectId[],
    config: IGuildConfig,
    modules_config: Map<string, Object>
}

interface IGuildConfig {
    _id: Types.ObjectId;
    prefix: string;
}

interface IGuildMethods {
    cacheSave(): Promise<boolean>,
    addMember(member: HydratedMember | GuildMember | string): Promise<void>,
    removeMember(member: HydratedMember | GuildMember | string): Promise<void>,
    remove(): Promise<boolean>
}

export type GuildModelType = Model<IGuild, {}, IGuildMethods>;
export type HydratedGuild = HydratedDocument<IGuild, IGuildMethods>

const schema = new Schema<IGuild, GuildModelType, IGuildMethods>({
    id: { type: String, required: true, unique: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    join_at: { type: Date, default: new Date() },
    owner_id: { type: String, required: true },

    config: new Schema<IGuildConfig>({
        prefix: { type: String, default: default_prefix }
    }),
    modules_config: { type: Map, of: Object, default: new Map() }
});
schema.method('cacheSave', async function cacheSave() {
    if (!this.client) throw new Error('No client passed to GuildModel instance')
    try {
        this.client.guilds_cache.set(this.id, this);
        await this.save();
    } catch (err) {
        this.client.log.error(err);
    }
});



export default class db_GuildsManager {
    private client: UClient;
    private database: DatabaseManager;
    GuildModel: GuildModelType = model<IGuild, GuildModelType>('Guild', schema);

    constructor(client: UClient) {
        this.client = client;
        this.database = client.database;
    }

    async exists(guild: Guild | string): Promise<boolean> {
        let id: string;

        if (guild instanceof Guild) id = guild.id;
        else id = guild;

        if (this.client.guilds_cache.has(id)) return true;

        let result;
        try{
            result = await this.GuildModel.exists({ id: id });
        } catch (err) {
            this.client.log.error(err);
            return false;
        }
        if(result) return true;
        else return false;
    }

    async getAll(): Promise<HydratedGuild[] | null> {
        try {
            const docs = await this.GuildModel.find();
            if (docs) { 
                docs.forEach(v => v.client = this.client);
                return docs;
            }
            else return null;
        } catch (err) {
            this.client.log.error(err);
        }
        return null;
    }

    async get(guild: Guild | string): Promise<HydratedGuild | null> {
        let id: string | null = null;
        if (guild instanceof Guild) id = guild.id;
        else id = guild;

        if (this.client.guilds_cache.has(id)) return this.client.guilds_cache.get(id)!;

        if (!id) return null;
        else {
            let doc: HydratedGuild | undefined | null;

            try{
                doc = await this.GuildModel.findOne({ id: id });
            } catch (err) {
                this.client.log.error(err);
                return null;
            }
            
            if(!doc) return null;
            else {
                doc.client = this.client;
                return doc;
            }
        }
    }

    async getOrCreate(guild: Guild): Promise<HydratedGuild | null> {
        let doc: HydratedGuild | undefined | null;

        if (this.client.guilds_cache.has(guild.id)) return this.client.guilds_cache.get(guild.id)!;

        try {
            doc = await this.GuildModel.findOne({ id: guild.id });
            if (!doc) {
                doc = new this.GuildModel({
                    id: guild.id,
                    owner_id: guild.ownerId,
                    config: {
                        _id: new Types.ObjectId(),
                    }
                });

                for (const module of this.client.modules.values()) {
                    if (module.default_config) {
                        doc.modules_config.set(module.meta.name, module.default_config);
                    }
                }
                doc.client = this.client;

                await doc.cacheSave();
                return doc;
            } else {
                doc.client = this.client;
                return doc;
            }
        } catch (err) {
            this.client.log.error(err);
            return null;
        }
    }

    async remove(guild: string | Guild) {
        let guild_id;

        if (guild instanceof Guild) guild_id = guild.id;
        else guild_id = guild;

        if (this.client.guilds_cache.has(guild_id)) this.client.guilds_cache.delete(guild_id);

        try{
            await this.GuildModel.deleteMany({ id: guild_id });
            await this.database.members.MemberModel.deleteMany({ guild_id: guild_id });
        } catch (err) {
            this.client.log.error(err);
        }
        this.client.log.info(`Guild ${guild_id} and its members removed from database`);
    }
}