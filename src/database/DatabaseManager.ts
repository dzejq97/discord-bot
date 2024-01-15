import UClient from "src/classes/UClient";
import db_GuildsManager from "./models/guilds";

export default class DatabaseManager {
    client: UClient;

    guilds: db_GuildsManager;

    constructor(client: UClient) {
        this.client = client;

        this.guilds = new db_GuildsManager(client, this);
    }
}