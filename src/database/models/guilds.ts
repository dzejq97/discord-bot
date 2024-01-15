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
    updateConfig(database: DatabaseManager): Promise<boolean>,
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
schema.method('updateConfig', async function updateConfig(database: DatabaseManager) {
    database.guilds.GuildConfigs.set(this.id, this.config);
    try {
        await this.save();
    } catch (err) {
        database.client.log.error(err);
    }
})



export default class db_GuildsManager {
    private client: UClient;
    private database: DatabaseManager;
    GuildModel: GuildModelType = model<IGuild, GuildModelType>('Guild', schema);
    GuildConfigs: Collection<string, IGuildConfig> = new Collection();

    constructor(client: UClient, database: DatabaseManager) {
        this.client = client;
        this.database = database;
    }

    async get(guild: Guild | string): Promise<HydratedDocument<IGuild> | null> {
        let id: string | null = null;
        if (guild instanceof Guild) id = guild.id;
        else id = guild;

        if (!id) return null;
        else {
            let doc: HydratedDocument<IGuild> | null = null;
            try{
                doc = await this.GuildModel.findOne({ id: id });
            } catch (err) {
                this.client.log.error(err);
            }

            if(!doc) return null;
            else return doc;
        }
    }

    async getOrCreate(guild: Guild): Promise<HydratedDocument<IGuild> | null> {
        let doc: HydratedDocument<IGuild> | null;

        try {
            doc = await this.GuildModel.findOne({ id: guild.id });
            if (!doc) {
                doc = await this.GuildModel.create({
                    id: guild.id,
                    owner_id: guild.ownerId
                });
                
                await doc.save();
                return doc;
            } else {
                return doc;
            }
        } catch (err) {
            this.client.log.error(err);
        }
        return null;
    }
}