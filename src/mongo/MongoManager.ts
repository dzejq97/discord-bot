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
}
