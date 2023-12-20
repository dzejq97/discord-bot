// U B O J N I About Discord bot
// v0.0.0
// Created with <3 by Dawid Niedziółka @SZajbuS
// dniedziolka1997@gmail.com

import CustomClient from "./classes/CustomClient";
import { Token } from './config.json'

const client = new CustomClient();
client.init();

client.login(Token);