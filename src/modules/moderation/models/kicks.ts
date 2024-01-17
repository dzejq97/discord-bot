import { Schema, model, Model, HydratedDocument, Types } from 'mongoose';

export interface IKick {
    _id: Types.ObjectId,
    user_id: string;
    admin_id: string,
    reason: string,
    timestamp: Date
}

const schema = new Schema<IKick>({
    _id: { type: Schema.Types.ObjectId, default: new Types.ObjectId() },
    user_id: { type: String, required: true },
    admin_id: { type: String },
    reason: { type: String, default: 'brak'},
    timestamp: { type: Date, default: Date.now() }
});

module.exports = model<IKick>('Kick', schema);