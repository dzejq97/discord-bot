import ICommand from "src/interfaces/ICommand";
import UClient from "./UClient";
import { Guild, GuildMember, Message, User } from "discord.js";
import ms from "ms";

export default class CommandContext {
    client: UClient;
    module: any;
    message: Message;
    author: GuildMember | User;
    guild: Guild | null;
    command?: ICommand;
    used_prefix?: string;
    used_alias?: string;
    args?: Array<string>;

    constructor(client: UClient, message: Message) {
        this.client = client;
        this.message = message;
        if (message.member) this.author = message.member;
        else this.author = message.author;
        this.guild = message.guild
    }

    async respond(message: string, reply?: boolean) {
        try {
            let reply_message: Message;
            if (reply) 
                reply_message = await this.message.reply(message);
            else
                reply_message = await this.message.channel.send(message);

            if (this.command?.meta.autodelete_reply_message)
                setTimeout( async () => await reply_message.delete(), ms('10s'));
            
        } catch (err) {
            if (err instanceof Error) console.log(err.message);
            else console.log(String(err));
        }
    }
}