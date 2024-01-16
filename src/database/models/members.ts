import { Schema, model, Types, Model, HydratedDocument } from 'mongoose';
import UClient from 'src/classes/UClient';
import DatabaseManager from '../DatabaseManager';
import { Collection, Guild, GuildMember, User } from 'discord.js';

interface IMember {
    id: string,
    guild_id: string,
    join_at: Date,
    money: number,
    xp: number,
    required_xp: number,
    level: number,
    bumps: number,
}
interface IMemberMethods {
    update(database: DatabaseManager): Promise<boolean>,
}

type MemberModelType = Model<IMember, {}, IMemberMethods>;

const schema = new Schema<IMember, MemberModelType, IMemberMethods>({
    id: { type: String, required: true },
    guild_id: { type: String, required: true},
    join_at: { type: Date, default: new Date() },
    money: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    required_xp: { type: Number, default: 10 }, // Change this
    level: { type: Number, default: 1 },
    bumps: { type: Number, default: 0 }
});
schema.method('update', async function update(database: DatabaseManager) {
    try {
        await this.save();
        database.members.cache.set(this.id, this);
    } catch (err) {
        database.client.log.error(err);
    }
})

export default class db_MembersManager {
    private client: UClient;
    private database: DatabaseManager;
    cache: Collection<string, HydratedDocument<IMember>> = new Collection();
    MemberModel: MemberModelType = model<IMember, MemberModelType>('Member', schema);

    constructor(client: UClient) {
        this.client = client;
        this.database = client.database;
    }

    async exists(member: string | User | GuildMember, guild: string | Guild): Promise<boolean>{
        let member_id: string, guild_id: string;
        if (member instanceof User || member instanceof GuildMember)
            member_id = member.id;
        else member_id = member;

        if (guild instanceof Guild) guild_id = guild.id;
        else guild_id = guild;

        if (!member_id || !guild_id) return false;

        let result;
        try {
            result = await this.MemberModel.exists({ id: member_id, guild_id: guild_id });
        } catch (err) {
            this.client.log.error(err);
            return false;
        }
        if (result) return true;
        else return false;
    }

    async get(member: string | User | GuildMember, guild: string | Guild): Promise<HydratedDocument<IMember> | null> {
        let member_id: string, guild_id: string;
        if (member instanceof User || member instanceof GuildMember)
            member_id = member.id;
        else member_id = member;

        if (guild instanceof Guild) guild_id = guild.id;
        else guild_id = guild;

        if (!guild_id || !member_id) return null;
        else {
            let doc: HydratedDocument<IMember> | null = null;
            try {
                doc = await this.MemberModel.findOne({ id: member_id, guild_id: guild_id });
            } catch (err) {
                this.client.log.error(err);
                return null;
            }

            if (!doc) return null;
            else return doc;
        }
    }

    async getOrCreate(member: string | User | GuildMember, guild: string | Guild): Promise<HydratedDocument<IMember> | null> {
        let member_id: string, guild_id: string
        let doc: HydratedDocument<IMember> | null = null;

        if (member instanceof User || member instanceof GuildMember)
            member_id = member.id;
        else member_id = member;
        if (!member_id) return null;

        if (guild instanceof Guild) guild_id = guild.id;
        else guild_id = guild;
        if (!guild_id) return null;

        try {
            doc = await this.MemberModel.findOne({ id: member_id, guild_id: guild_id });
            if (!doc) {
                doc = await this.MemberModel.create({
                    id: member_id,
                    guild_id: guild_id,
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