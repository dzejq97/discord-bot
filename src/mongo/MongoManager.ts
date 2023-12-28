import CustomClient from "src/classes/CustomClient";
import { Model, Types } from "mongoose";

import Member, { IMember } from './models/member'
import Guild, { IGuild } from "./models/guild";
import Cooldown, { ICooldown } from "./models/cooldown";

import { GuildMember, Guild as dsc_Guild } from "discord.js";

export default class MongoManager {
    client: CustomClient;

    Member: Model<IMember> = Member;
    Guild: Model<IGuild> = Guild;
    Cooldown: Model<ICooldown> = Cooldown;

    constructor(client: CustomClient) {
        this.client = client;
    }

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
