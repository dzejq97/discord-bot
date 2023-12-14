import MainClient from "src/classes/CustomClient";
import CommandsManager from "./CommandsManager";
import ComandArgument from "./CommandArgument";
import { Message, User, GuildMember, Guild, Collection} from "discord.js";
import ms from 'ms';

enum EArgsFormats {
    single_string = "single_string",
    multi_string = "multi_string",
    number = "number",
    member = "member",
    user = "user",
    role = "role",
    channel = "channel",
    time = "time"
}

const usableTypes: string[] = [
    "single_string",
    "multi_string",
    "number",
    "member",
    "user",
    "role",
    "channel",
    "time",
]

interface IParserElement {
    index: number;
    type?: string;
    optional?: boolean;
}

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

    verifyAuthorPermissions(permissions: bigint[] | undefined): boolean {
        if (!permissions) return false;
        if (this.message.member?.permissions.has(permissions)) return true;
        else return false;
    }

    async parseArguments(format: string | undefined) {
        if(!format || !this.arguments) return false;

        const ArgumentsTypes: IParserElement[] = [];
        let lastIsMultiString: boolean = false;

        let i = 0;
        for (let str of format.split(' ')) {
            if (lastIsMultiString) break;

            const el: IParserElement = {
                index: i,
            };

            if (str.startsWith('<') && str.endsWith('>')) el.optional = false;
            else if (str.startsWith('[') && str.endsWith(']')) el.optional = true;
            else return false;

            const typeName = str.substring(1, str.length - 1);
            if (usableTypes.includes(typeName)) {
                el.type = typeName;
                if (el.type === 'multi_string') lastIsMultiString = true;
            } else return false;

            ArgumentsTypes.push(el);
            i++;
        }

        // Too much arguments without <multi_string> at end of format
        if (!lastIsMultiString && this.arguments.length > ArgumentsTypes.length) return false;

        i = 0;
        for (const arg of this.arguments) {

        }
    }
}