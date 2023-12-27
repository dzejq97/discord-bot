import { Schema, model, createConnection} from 'mongoose';

export interface IGuild {
    id: String,
    join_at: Date,
    owner_id: String,
}

const schema = new Schema<IGuild>({
    id: { type: String, required: true, unique: true },
    join_at: { type: Date, default: new Date() },
    owner_id: { type: String, required: true }
});

export default model<IGuild>('Guild', schema);