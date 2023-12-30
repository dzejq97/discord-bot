import { Events } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import {XpStep} from "../config.json"
import ms from 'ms'

export = {
    name: Events.ClientReady,
    once: true,

    async execute(client: CustomClient) {
        client.logger.success(`Client ready! Logged in as ${client.user?.tag}`);
        await client.mongo.startupSync();
        await client.cooldowns.initLoadCooldowns();

        const reminds = await client.mongo.BumpRemind.find();
        for (const remind of reminds) {
            if (remind.last_bump_time.getTime() + ms('2h') <= Date.now()) {
                client.mongo.BumpRemind.deleteMany({guild_id: remind.guild_id});
                await client.bumpRemind(remind);
                return;
            } else {
                setTimeout(async () => await client.bumpRemind(remind), ms('2h'));
                return;
            }
        }
        
    }
};