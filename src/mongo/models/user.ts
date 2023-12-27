import { Schema, model } from 'mongoose';

export interface IUser {
    id: string,
    join_at: Date,
    money: number,
    reputation: number,
    xp: number,
    req_xp: number,
    level: number
}

const schema = new Schema<IUser>({
    id: { type: String, required: true, unique: true },
    join_at: { type: Date, default: new Date() },
    money: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    //////// CHANGE THIS
    req_xp: { type: Number, default: 10},
    level: { type: Number, default: 1 }
});

export default model<IUser>('User', schema);