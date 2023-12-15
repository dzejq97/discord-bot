import MainClient from "src/classes/CustomClient";
import CommandsManager from "./CommandsManager";
import ComandArgument from "./CommandArgument";
import { Message, User, GuildMember, Guild, Collection, PermissionFlagsBits} from "discord.js";

export default class CommandContext {
    client: MainClient;
    commands_manager: CommandsManager;
    message: Message;
    used_prefix?: string;
    used_alias?: string;
    arguments?: Array<ComandArgument>;
    parsed_arguments?: Collection<string, any>;
    constructor (client: MainClient, commands_manager: CommandsManager, message: Message) {
        this.client = client;
        this.commands_manager = commands_manager;
        this.message = message;
    }

    async executionFailed(msg: string, proper_usage?: string): Promise<void> {
        const emb = this.client.embeds.empty();
        emb.setTitle(msg);
        if (proper_usage && proper_usage.length > 0) emb.setDescription('Use `'+ proper_usage + '`');

        await this.message.reply({embeds: [emb]});
    }

    verifyAuthorPermissions(permissions: bigint[] | undefined): boolean {
        if (!permissions) return false;
        if (this.message.member?.permissions.has(permissions)) return true;
        else return false;
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

    joinArguments(): string | null {
        if (!this.arguments) return null;
        let str = "";
        for (const arg of this.arguments) {
            str += " " + arg.content;
        }
        if (str.length > 0) return str;
        else return null;
    }
}