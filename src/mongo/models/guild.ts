import { Schema, model, Types, Model} from 'mongoose';
import { DefaultPrefix } from '../../config.json';

export interface IGuild {
    id: string,
    join_at: Date,
    owner_id: string,
    members: Types.ObjectId[];
    settings: IGuildSettings;
}

export interface IGuildSettings {
    _id: Types.ObjectId,
    prefix: string;
    cmd_channel_mode: string,
    cmd_channel_blacklist: string[],
    cmd_channel_whitelist: string[],
    bump_remind_roles: string[];

}


type GuildModelType = Model<IGuild>

const schema = new Schema<IGuild, GuildModelType>({
    id: { type: String, required: true, unique: true },
    members: [{type: Schema.Types.ObjectId, ref: 'Member'}],
    join_at: { type: Date, default: new Date() },
    owner_id: { type: String, required: true },

    settings: new Schema<IGuildSettings>({
        prefix: {type: String, default: DefaultPrefix},
        cmd_channel_mode: { type: String, default: 'any'},
        cmd_channel_blacklist: [{ type: String }],
        cmd_channel_whitelist: [{ type: String }],
    }),
});

export default model<IGuild, GuildModelType>('Guild', schema);