import CustomClient from "src/classes/CustomClient";
import * as mongoose from "mongoose";

import user from './models/user'
import guild from "./models/guild";
import cooldown from "./models/cooldown";

export default class MongoManager {
    client: CustomClient;
    connection: mongoose.Connection | undefined;
    auth = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_ROOT_USERNAME,
        password: process.env.DB_ROOT_PASSWORD,
        database_name: process.env.DB_NAME,
    }
    connect_URL: string = "";

    User = user;
    Guild = guild;
    Cooldown = cooldown

    constructor(client: CustomClient) {
        this.client = client;
        
        if (this.client.run_mode === 'dev') {
            this.auth.host = '127.0.0.1'
        }

        this.connect_URL = `mongodb://${this.auth.host}:${this.auth.port}/${this.auth.database_name}`
    }

    async connect() {
        this.connection = (await mongoose.connect(this.connect_URL, {
            authSource: 'admin',
            user: this.auth.username,
            pass: this.auth.password,
        })).connection
        
    }
}