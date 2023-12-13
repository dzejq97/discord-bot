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

        let ElementsCollection: Collection<number, IParserElement> = new Collection();

        let i = 0;
        let multi_string_check = 0;
        format.split(" ").forEach( str => {
            // Create element and give index
            let el: IParserElement = {
                index: i,
            };

            // Check if argument is passed as optional
            if (str.startsWith('<') && str.endsWith('>')) el.optional = false;
            else if (str.startsWith('[') && str.endsWith(']')) el.optional = true;
            else return false;

            //Check type
            const typeName = str.substring(1, str.length - 1);
            if (usableTypes.includes(typeName)) el.type = typeName;
            else return false;
            i++;
        });

        for (const arg of this.arguments) return;
    }
}