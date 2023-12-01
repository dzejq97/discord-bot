import MainClient from "src/main_client";

export default class DatabaseManager {
    client: MainClient;
    
    constructor(client:MainClient) {
        this.client = client;
    }
}