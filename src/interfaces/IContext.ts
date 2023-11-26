import MainClient from "src/main_client";
import { Message } from "discord.js";

export interface IContext {
    client?: MainClient;
    message?: Message;
    used_prefix?: string;
    used_alias?: string;
}