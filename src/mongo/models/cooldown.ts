import * as mongoose from 'mongoose';

export interface ICooldown {
    user_id: string,
    name: string,
    start: Date,
    time: number
}

const cooldown = mongoose.model('Cooldown', new mongoose.Schema<ICooldown>({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    start: { type: Date, default: new Date() },
    time: { type: Number, required: true },
}));

export default cooldown;