import { Collection } from "discord.js";
import CustomClient from "./CustomClient";
import { Timeout } from "@prisma/client";

export default class TimeoutsManager {
    client: CustomClient;
    timeouts: Collection<string, Timeout> = new Collection();

    constructor (client: CustomClient) {
        this.client = client;
    }

    async loadTimeouts() {
        try {
            const timeouts = await this.client.prisma.timeout.findMany();
            for ( const timeout of timeouts.values()) {
                if (timeout.start.getTime() + timeout.time <= Date.now()) {
                    await this.client.prisma.timeout.delete({where: { id: timeout.id }});
                    continue;
                } else {
                    setTimeout(async () => await this.createTimeout(timeout.user_id, timeout.name, timeout.time));
                    continue;
                }
            }

            timeouts.forEach( async ( timeout ) => {
                let now = Date.now();
                let start = timeout.start.getTime()

                if (timeout.start.getTime() + timeout.time <= Date.now()) {
                    await this.client.prisma.timeout.delete({where: { id: timeout.id }});
                }
            })
        } catch (error) {
            this.client.logger.failed(String(error));
        }
    }

    async createTimeout(user_id: string, name: string, time: number) {
        try {
            const timeout = await this.client.prisma.timeout.create({data: {
                name: name,
                time: time,
                user: { connect: { id: user_id}}
            }});
            
            this.timeouts.set(user_id, timeout);
            setTimeout(async () => await this.clearTimeout(user_id, name))
            return;
        } catch (error) {
            return this.client.logger.error(String(error));
        }
    }

    clearTimeout(user_id: string, name: string) {

    }
}