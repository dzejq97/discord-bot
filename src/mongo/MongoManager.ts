import CustomClient from "src/classes/CustomClient";
import { HydratedDocument, Model, Types } from "mongoose";

import Member, { IMember } from './models/member'
import Guild, { IGuild, IGuildSettings } from "./models/guild";
import Cooldown, { ICooldown } from "./models/cooldown";

import { Collection, GuildMember, Guild as dsc_Guild } from "discord.js";

export default class MongoManager {
    client: CustomClient;

    Member: Model<IMember> = Member;
    Guild: Model<IGuild> = Guild;
    Cooldown: Model<ICooldown> = Cooldown;
    
    guilds_settings: Collection<string, IGuildSettings> = new Collection();


    constructor(client: CustomClient) {
        this.client = client;
    }

    async guild_saveAndCache(guild: HydratedDocument<IGuild>) {
        this.guilds_settings.set(guild.id, guild.settings);
        try {
            await guild.save();
        } catch (error) {
            if (error instanceof Error) return this.client.logger.error(error.message);
        }
    }

    /*
    async getMember(user_id: String, guild_id: String): Promise<HydratedDocument<IMember> | null> {
        let member: HydratedDocument<IMember> | undefined | null = this.cache_members.get(user_id);
        if (member) return member;
        
        member = await this.Member.findOne({ id: user_id, guild_id: guild_id });
        if (member) {
            this.cache_members.set( user_id, member );
            return member;
        }
        return null;
    }

    async getGuild(guild_id: String): Promise<HydratedDocument<IGuild>|null> {
        let guild: HydratedDocument<IGuild> | undefined | null = this.cache_guilds.get(guild_id);
        if (guild) return guild;
    }
*/
    async guildCreateAndSync(discordGuild: dsc_Guild) {
        try {
            let guild = await this.Guild.findOne({ id: discordGuild.id });
            if (!guild) {
                guild = new this.Guild({
                    id: discordGuild.id,
                    owner_id: discordGuild.ownerId,
                    settings: {
                        _id: new Types.ObjectId(),
                    }
                });
            }

            const discordMembers = await discordGuild.members.fetch();
            for (let discordMember of discordMembers.values()) {
                if (!await this.Member.exists({ id: discordMember.id, guild_id: discordGuild.id })) {
                    const member = new this.Member({
                        id: discordMember.id,
                        guild_id: discordGuild.id,
                        guild: guild?._id
                    });
                    guild?.members.push(member._id);
                    await guild?.save();
                    await member.save();
                }
            }
        } catch (error) {

        }
    }

    async memberCreate(discordMember: GuildMember) {
        let guild = await this.Guild.findOne({ id: discordMember.guild.id });
        if ( !guild ) return;
        let member = await this.Member.findOne({ id: discordMember.id, guild_id: discordMember.guild.id });

        if ( !member ) {
            member = new this.Member({
                id: discordMember.id,
                guild_id: discordMember.guild.id,
                guild: guild._id
            })
        }
        guild.members.push(member._id);
        await guild.save();
        await member.save();
    }

    async startupSync() {
        try {
            const OAGuilds = await this.client.guilds.fetch();
            for ( let OAGuild of OAGuilds.values()) {
                const discordGuild = await OAGuild.fetch();
                this.guildCreateAndSync(discordGuild);
            } 
        } catch (error) {
            
        }
    }
}
