// U B O J N I About Discord bot
// v0.0.0
// Created with <3 by Dawid Niedziółka @SZajbuS
// dniedziolka1997@gmail.com

import MainClient from "./main_client";
import { Token } from './config.json'

const client = new MainClient();
client.loadEvents();

client.login(Token);

export default client;