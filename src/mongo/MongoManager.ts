import CustomClient from "src/classes/CustomClient";
import { Model } from "mongoose";

import User, { IUser } from './models/user'
import Guild, { IGuild } from "./models/guild";
import Cooldown, { ICooldown } from "./models/cooldown";

export default class MongoManager {
    client: CustomClient;

    User: Model<IUser> = User;
    Guild: Model<IGuild> = Guild;
    Cooldown: Model<ICooldown> = Cooldown;

    constructor(client: CustomClient) {
        this.client = client;
    }

    async synchronize() {
        try {
            (await this.client.guilds.fetch()).forEach( async (OAGuild) => {
                const guild = await OAGuild.fetch();

                if (!await this.Guild.find({ id: guild.id })) {
                    const g = new this.Guild({
                        id: guild.id,
                        owner_id: guild.ownerId,
                    })
                    await g.save();
                }
                

                (await guild.members.fetch()).forEach( async (member) => {
                    if (!await this.User.find({ id: member.user.id }) && !member.user.bot) {
                        const m = new this.User({
                            id: member.user.id,
                        })
                        await m.save();
                    }
                })
            })
        } catch (err) {
            console.log(String(err));
        }
    }
}
