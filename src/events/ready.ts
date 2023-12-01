import { Events } from 'discord.js';
import MainClient from 'src/main_client';

export = {
    name: Events.ClientReady,
    once: true,

    async execute(client: MainClient) {
        client.logger.success(`Client ready! Logged in as ${client.user?.tag}`);

        client.logger.info("Synchronizing database");
        
        (await client.guilds.fetch()).forEach(async OAGuild => {
            const guild = await OAGuild.fetch();
            if (!await client.prisma.guild.findUnique({where: {id: guild.id}})) {
                await client.prisma.guild.create({
                    data: {
                        id: guild.id,
                        owner_id: guild.ownerId,
                    }
                })
            }

            (await guild.members.fetch()).forEach(async (member) => {
                if (!await client.prisma.user.findUnique({where: {id: member.user.id}} || member.user.bot)) {
                    await client.prisma.user.create({
                        data: {
                            id: member.user.id,
                        }
                    })
                }
            })
        })


    }
};