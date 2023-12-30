import MainClient from "src/classes/CustomClient";
import ComandArgument from "./CommandArgument";
import { Message, User, GuildMember, Guild, Collection, PermissionFlagsBits, MessagePayload} from "discord.js";
import { ICommand } from "src/interfaces/ICommand";
import ms from 'ms';
import MongoManager from "src/mongo/MongoManager";

export default class CommandContext {
    client: MainClient;
    command: ICommand = <ICommand>{}
    message: Message;
    mongo: MongoManager;
    guild: Guild | null;
    author: GuildMember | User;
    used_prefix?: string;
    used_alias?: string;
    arguments?: Array<ComandArgument>;
    
    constructor (client: MainClient, message: Message) {
        this.client = client;
        this.mongo = client.mongo;
        this.message = message;
        if (message.guild)
            this.guild = message.guild;
        else
            this.guild = null;

        this.author = message.author;

    }

    async reply(content: string) {
        const reply = await this.message.reply({content: content});
        setTimeout(async () => await reply.delete(), ms('10s'));
        setTimeout(async () => await this.message.delete(), ms('10s'));
    }

    async canExecute(): Promise<boolean> {
        // Check permissions
        if (this.command.meta.required_permissions && this.message.member) {
            if (!this.message.member.permissions.has(this.command.meta.required_permissions)) {
                const reply = await this.message.reply(`You dont have permission to use this command`);
                setTimeout( async () => await reply.delete(), ms('5s'));
                setTimeout( async () => await this.message.delete(), ms('5s'));
                return false;
            }
        }

        // Check cooldown
        if (this.command.meta.cooldown) {
            let cooldown = this.client.cooldowns.active.find(cd => cd.name === this.command.meta.cooldown?.name && cd.user_id === this.author.id);
            if (cooldown) {
                if (this.command.meta.cooldown.feedback_message) {
                    const reply = await this.message.reply(`You can use this command again in ${ms(cooldown.time - (Date.now() - cooldown.start), {long: true})}`);

                    setTimeout( async () => await reply.delete(), ms('5s'));
                    setTimeout( async () => await this.message.delete(), ms('5s'));
                    return false;
                }
            } else {
                await this.client.cooldowns.set(
                    this.author.id,
                    this.command.meta.cooldown.name,
                    this.command.meta.cooldown.time,
                    this.command.meta.cooldown.database_save,
                )
            }
        }

        return true;
    }

    async executionFailed(msg: string, proper_usage?: string): Promise<void> {
        const emb = this.client.embeds.empty();
        emb.setTitle(msg);
        if (proper_usage && proper_usage.length > 0) emb.setDescription('Use `'+ proper_usage + '`');

        await this.message.reply({embeds: [emb]});
    }

    verifyTargetPermissions(targetMember: GuildMember): boolean {
        if (targetMember.permissions.has([
            PermissionFlagsBits.Administrator,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.MuteMembers,
        ])) return false;
        return true;
    }

    joinLeftArguments(): string | null {
        if (!this.arguments) return null;
        let str = "";
        for (const arg of this.arguments) {
            str += " " + arg.content;
        }
        if (str.length > 0) return str;
        else return null;
    }
}