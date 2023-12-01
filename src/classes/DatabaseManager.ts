import MainClient from "src/main_client";
import { PrismaClient } from "@prisma/client";

export default class DatabaseManager {
    client: MainClient;
    prisma: PrismaClient;
    
    constructor(client: MainClient) {
        this.client = client;
        this.prisma = new PrismaClient();

    }
}