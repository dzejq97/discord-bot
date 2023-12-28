import { Schema, Types, model } from 'mongoose';
import { XpStep } from '../../config.json'

export interface IMember {
    id: string,
    guild: Types.ObjectId,
    guild_id: string,
    join_at: Date,
    money: number,
    reputation: number,
    xp: number,
    req_xp: number,
    level: number,
}

const schema = new Schema<IMember>({
    id: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: 'Guild'},
    guild_id: { type: String, required: true },
    join_at: { type: Date, default: new Date() },
    money: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    //////// CHANGE THIS
    req_xp: { type: Number, default: XpStep},
    level: { type: Number, default: 1 }
});

export default model<IMember>('Member', schema);