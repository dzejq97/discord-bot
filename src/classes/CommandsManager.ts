import MainClient from "src/main_client";

export default class CommandsManager {
    client: MainClient;
    constructor(client: MainClient) {
        this.client = client;
    }
}