import mongoose, { Schema, model } from 'mongoose';

export interface ICooldown {
    user_id: string,
    name: string,
    start: Date,
    time: number
}

const schema = new Schema<ICooldown>({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    start: { type: Date, default: new Date() },
    time: { type: Number, required: true },
});

export default model<ICooldown>('Cooldown', schema);