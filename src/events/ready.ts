import { Events } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import {XpStep} from "../config.json"

export = {
    name: Events.ClientReady,
    once: true,

    async execute(client: CustomClient) {
        client.logger.success(`Client ready! Logged in as ${client.user?.tag}`);
        
        client.logger.info("Synchronizing database");
        try {
            (await client.guilds.fetch()).forEach(async OAGuild => {
                const guild = await OAGuild.fetch();

                if (!await client.mongo.Guild.findOne({ id: guild.id })) {
                    const g = new client.mongo.Guild({
                        id: guild.id,
                        owner_id: guild.ownerId
                    });
                    await g.save();
                }
    
                (await guild.members.fetch()).forEach(async (member) => {
                    if (!await client.mongo.User.findOne({ id: member.user.id })) {
                        const m = new client.mongo.User({
                            id: member.user.id,
                            req_xp: XpStep,
                        });
                        await m.save();
                    }
                })
            })
            //await client.cooldowns.initLoadCooldowns();
        } catch (error) {
            client.logger.error(String(error));
            client.logger.error('Synchronizing failed');
        }
        client.logger.success('Synchronized');
        
    }
};