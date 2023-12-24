import * as mongoose from 'mongoose';

interface IGuild {
    id: String,
    join_at: Date,
    owner_id: String,
}

const guild = mongoose.model('Guild', new mongoose.Schema<IGuild>({
    id: { type: String, required: true, unique: true },
    join_at: { type: Date, default: new Date() },
    owner_id: { type: String, required: true }
}));

export default guild;