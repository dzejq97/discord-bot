import CustomClient from "src/classes/CustomClient";
import * as mongoose from "mongoose";

import user from './models/user'
import guild from "./models/guild";
import cooldown from "./models/cooldown";

export default class MongoManager {
    client: CustomClient;
    connection: mongoose.Connection | undefined;
    connect_URL: string | undefined = "";

    User = user;
    Guild = guild;
    Cooldown = cooldown

    constructor(client: CustomClient) {
        this.client = client;

        this.connect_URL = process.env.DB_URL;
    }

    async connect() {
        if (!this.connect_URL) {
            console.log('Database URL not provided');
            process.exit(1);
        }
        this.connection = (await mongoose.connect(this.connect_URL)).connection
        
    }
}