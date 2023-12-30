import { Schema, model, Types, Model} from 'mongoose';

export interface IBumpRemind {
    guild_id: string,
    last_bumper_id: string,
    last_bump_time: Date,
    channel_id: string,
}

const schema = new Schema<IBumpRemind>({
    guild_id: { type: String, required: true },
    last_bumper_id: {type: String, required: true},
    last_bump_time: {type: Date, required: true, default: Date.now()},
    channel_id: { type: String, required: true }
})

export default model<IBumpRemind>('BumpRemind', schema);