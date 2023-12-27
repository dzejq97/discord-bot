import { Events, Guild } from 'discord.js';
import CustomClient from 'src/classes/CustomClient';
import { XpStep } from '../config.json';

export = {
    name: Events.GuildCreate,
    once: false,

    async execute(client: CustomClient, guild: Guild) {
        client.logger.info(`guild joined ${guild.name}:${guild.id}`);
        try {
            if (!await client.mongo.Guild.exists({ id: guild.id })) {
                const g = new client.mongo.Guild({
                    id: guild.id,
                    owner_id: guild.ownerId,
                });
                await g.save();
            }

            (await guild.members.fetch()).forEach(async (member) => {
                if (!await client.mongo.User.exists({ id: member.user.id })) {
                    const u = new client.mongo.User({
                        id: member.user.id,
                        req_xp: XpStep,
                    });
                    await u.save();
                }
            });
            

            client.logger.info(`database added ${guild.name}:${guild.id}`);
        } catch (error) {
            client.logger.error(`failed adding guild database record ${guild.name}:${guild.id}`);
            console.log(error);
        }
    }
};