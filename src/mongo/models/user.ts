import * as mongoose from 'mongoose';

export interface IUser {
    id: string,
    join_at: Date,
    money: number,
    reputation: number,
    xp: number,
    req_xp: number,
    level: number
}

const schema = new mongoose.Schema<IUser>({
    id: { type: String, required: true, unique: true },
    join_at: { type: Date, default: new Date() },
    money: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    //////// CHANGE THIS
    req_xp: { type: Number, default: 10},
    level: { type: Number, default: 1 }
});

const user = mongoose.model('User', schema);
export default user;