import UClient from "src/classes/UClient";
import db_GuildsManager, { HydratedGuild } from "./models/guilds";
import db_MembersManager from "./models/members";
import CooldownManager from "./models/cooldowns";
import { Collection } from "discord.js";

export default class DatabaseManager {
    client: UClient;

    guilds: db_GuildsManager;
    members: db_MembersManager;
    cooldowns: CooldownManager;

    constructor(client: UClient) {
        this.client = client;

        this.guilds = new db_GuildsManager(client);
        this.members = new db_MembersManager(client);
        this.cooldowns = new CooldownManager(client);
    }

    async sync() {
        this.client.log.info(`Synchronizing database...`)
        const oaGuilds = await this.client.guilds.fetch();
        if (!oaGuilds) throw new Error('Failed fetching guilds');
        
        // Clear guilds left during offline
        const db_guilds = await this.guilds.getAll();
        let deleted_guilds = 0;
        if (db_guilds) {
            for (const db_guild of db_guilds) {
                if (!oaGuilds.has(db_guild.id)) {
                    this.guilds.remove(db_guild.id);
                    deleted_guilds++;
                }
            }
            if(deleted_guilds > 0)
                this.client.log.info(`Deleted ${deleted_guilds} left during offline`);
        }


        for (const oaGuild of oaGuilds?.values()) {
            const guild = await oaGuild.fetch();
            const doc = await this.guilds.getOrCreate(guild);
            this.client.log.info(`Guild ${guild.name}:${guild.id} fetched`);

            const members = await guild.members.fetch();
            for (const member of members.values()) {
                const m = await this.members.getOrCreate(member, guild);
                if (m)
                    doc?.members.push(m._id)
            }

            await doc?.cacheSave();

            // Clear members left during offline
            const db_members = await this.members.getAll(guild);
            let deleted_members = 0;
            if (db_members) {
                for(const db_member of db_members) {
                    if (!members.has(db_member.id)) {
                        this.members.remove(db_member.id, guild);
                        deleted_members++;
                    }
                }
                if(deleted_members > 0)
                    this.client.log.info(`Deleted ${deleted_members} members left during offline from ${guild.name}:${guild.id}`);
            }

            this.client.log.info(`Members of ${guild.name}:${guild.id} fetched`);
        }
        this.client.log.info('Loading modules configurations into their instances')
    

        this.client.log.success('Database synchronized');
    }
}