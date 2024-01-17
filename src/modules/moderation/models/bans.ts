import { Schema, model, Model, Types } from 'mongoose';

export interface IBan {
    _id: Types.ObjectId,
    user_id: string,
    admin_id: string,
    reason: string,
    timestamp: Date,
    time: number
}

const schema = new Schema<IBan>({
    _id: { type: Schema.Types.ObjectId, default: new Types.ObjectId() },
    user_id: { type: String, required: true },
    admin_id: { type: String },
    reason: { type: String, default: 'brak' },
    timestamp: { type: Date, default: Date.now() },
    time: { type: Number },
});

module.exports = model<IBan>('Ban', schema);