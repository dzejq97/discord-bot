import { Schema, model, Types, Model, HydratedDocument, Document} from 'mongoose';
import { default_prefix } from '../../config.json'
import UClient from 'src/classes/UClient';
import { Collection, Guild } from 'discord.js';
import DatabaseManager from '../DatabaseManager';

interface IGuild {
    id: string,
    join_at: Date,
    owner_id: string,
    members: Types.ObjectId[],
    config: IGuildConfig
}

interface IGuildConfig {
    _id: Types.ObjectId,
    prefix: string;
}

interface IGuildMethods {
    update(database: DatabaseManager): Promise<boolean>,
}

type GuildModelType = Model<IGuild, {}, IGuildMethods>;

const schema = new Schema<IGuild, GuildModelType, IGuildMethods>({
    id: { type: String, required: true, unique: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    join_at: { type: Date, default: new Date() },
    owner_id: { type: String, required: true },

    config: new Schema<IGuildConfig>({
        _id: { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
        prefix: { type: String, default: default_prefix }
    })
});
schema.method('update', async function update(database: DatabaseManager) {
    database.guilds.guilds_configs.set(this.id, this.config);
    try {
        await this.save();
        database.guilds.cache.set(this.id, this);
    } catch (err) {
        database.client.log.error(err);
    }
})



export default class db_GuildsManager {
    private client: UClient;
    private database: DatabaseManager;
    private GuildModel: GuildModelType = model<IGuild, GuildModelType>('Guild', schema);
    cache: Collection<string, HydratedDocument<IGuild>> = new Collection();
    guilds_configs: Collection<string, IGuildConfig> = new Collection();

    constructor(client: UClient) {
        this.client = client;
        this.database = client.database;
    }

    async exists(guild: Guild | string): Promise<boolean> {
        let id: string;

        if (guild instanceof Guild) id = guild.id;
        else id = guild;

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

    async get(guild: Guild | string): Promise<HydratedDocument<IGuild> | null> {
        let id: string | null = null;
        if (guild instanceof Guild) id = guild.id;
        else id = guild;

        if (!id) return null;
        else {
            let doc;
            doc = this.cache.get(id);
            if (doc) return doc;

            try{
                doc = await this.GuildModel.findOne({ id: id });
            } catch (err) {
                this.client.log.error(err);
                return null;
            }

            if(!doc) return null;
            else {
                this.cache.set(doc.id, doc);
                this.guilds_configs.set(doc.id, doc.config);
                return doc;
            }
        }
    }

    async getOrCreate(guild: Guild): Promise<HydratedDocument<IGuild> | null> {
        let doc;
        
        doc = this.cache.get(guild.id);
        if (doc) return doc;

        try {
            doc = await this.GuildModel.findOne({ id: guild.id });
            if (!doc) {
                doc = await this.GuildModel.create({
                    id: guild.id,
                    owner_id: guild.ownerId
                });                
                return doc;
            } else {
                return doc;
            }
        } catch (err) {
            this.client.log.error(err);
            return null;
        }
    }
}