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
                if (!await client.prisma.guild.findFirst({where: {id: guild.id}})) {
                    await client.prisma.guild.create({
                        data: {
                            id: guild.id,
                            owner_id: guild.ownerId,
                        }
                    })
                }
    
                (await guild.members.fetch()).forEach(async (member) => {
                    if (!await client.prisma.user.findFirst({where: {id: member.user.id}})) {
                        await client.prisma.user.create({
                            data: {
                                id: member.user.id,
                                req_xp: XpStep,
                            }
                        })
                    }
                })
            })
        } catch (error) {
            client.logger.error(String(error));
            client.logger.error('Synchronizing failed');
        }
        client.logger.success('Synchronized');


    }
};