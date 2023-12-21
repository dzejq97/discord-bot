import { Events, Guild } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import { XpStep } from '../config.json';

export = {
    name: Events.GuildCreate,
    once: false,

    async execute(client: CustomClient, guild: Guild) {
        client.logger.info(`guild joined ${guild.name}:${guild.id}`);
        try {
            if (!await client.prisma.guild.findFirst({where: { id: guild.id}})) {
                await client.prisma.guild.create({
                    data: {
                        id: guild.id,
                        owner_id: guild.ownerId,
                    }
                })
            }

            (await guild.members.fetch()).forEach(async (member) => {
                if (!await client.prisma.user.findFirst({where: { id: member.id }})) {
                    await client.prisma.user.create({
                        data: {
                            id: member.id,
                            req_xp: XpStep,
                            guilds: { connect: { id: guild.id }}
                        }
                    })
                } else {
                    await client.prisma.user.update({
                        where: {id: member.id},
                        data: {
                            guilds: { connect: {id: guild.id}}
                        }
                    })
                }
            })
            

            client.logger.info(`database added ${guild.name}:${guild.id}`);
        } catch (error) {
            client.logger.error(`failed adding guild database record ${guild.name}:${guild.id}`);
            console.log(error);
        }

    }
};