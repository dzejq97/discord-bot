import { Events } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import { PrismaClient } from "@prisma/client"

export = {
    name: Events.ClientReady,
    once: true,

    async execute(client: CustomClient) {
        client.logger.success(`Client ready! Logged in as ${client.user?.tag}`);

        client.logger.info("Synchronizing database");
        const prisma = new PrismaClient();
        try {
            (await client.guilds.fetch()).forEach(async OAGuild => {
                const guild = await OAGuild.fetch();
                if (!await prisma.guild.findUnique({where: {id: guild.id}})) {
                    await prisma.guild.create({
                        data: {
                            id: guild.id,
                            owner_id: guild.ownerId,
                        }
                    })
                }
    
                (await guild.members.fetch()).forEach(async (member) => {
                    if (!await prisma.user.findUnique({where: {id: member.user.id}} || member.user.bot)) {
                        await prisma.user.create({
                            data: {
                                id: member.user.id,
                            }
                        })
                    }
                })
            })
        } catch (error) {
            console.log(error);
            client.logger.error('Synchronizing failed');
        }
        client.logger.success('Synchronized');


    }
};