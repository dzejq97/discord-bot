import UClient from "src/classes/UClient";
import db_GuildsManager from "./models/guilds";
import db_MembersManager from "./models/members";
import CooldownManager from "./models/cooldowns";

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

        for (const oaGuild of oaGuilds?.values()) {
            const guild = await oaGuild.fetch();
            await this.guilds.getOrCreate(guild);
            this.client.log.info(`Guild ${guild.name}:${guild.id} fetched`);

            const members = await guild.members.fetch();
            for (const member of members.values()) {
                await this.members.getOrCreate(member, guild);
            }
            this.client.log.info(`Members of ${guild.name}:${guild.id} fetched`);
        }
        this.client.log.success('Database synchronized');
    }
}