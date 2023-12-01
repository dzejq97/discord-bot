import MainClient from "src/main_client";
import { GuildBasedChannel, GuildMember, Message, Role } from "discord.js";

export default class ComandArgument {
    content: string;
    client: MainClient;
    message: Message;

    constructor(argument: string, client: MainClient, msg: Message) {
        this.content = argument
        this.client = client;
        this.message = msg;
    }

    isMemberMention(): boolean {
        if (this.content.startsWith("<@") && this.content.endsWith(">")) return true;
        return false;
    }

    async getMember(): Promise<GuildMember | null> {
        if (!this.isMemberMention() || !this.message.guild) return null;

        const member_id = this.content.substring(2, this.content.length - 1);

        try {
            return await this.message.guild.members.fetch(member_id);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    isRoleMention(): boolean {
        if (this.content.startsWith("<@&") && this.content.endsWith(">")) return true;
        return false;
    }

    async getRole(): Promise<Role | null> {
        if (!this.isRoleMention() || !this.message.guild) return null;

        const role_id = this.content.substring(3, this.content.length - 1)

        try {
            const role = await this.message.guild.roles.fetch(role_id);
            if (!role) return null;
            else return role;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    isChannelMention(): boolean {
        if (this.content.startsWith("<#") && this.content.endsWith(">")) return true;
        return false;
    }

    async getChannel(): Promise<GuildBasedChannel | null> {
        if (!this.isChannelMention() || !this.message.guild) return null;

        const channel_id = this.content.substring(2, this.content.length - 1)

        try {
            const channel = await this.message.guild.channels.fetch(channel_id);
            if (!channel) return null;
            else return channel;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}