// U B O J N I About Discord bot
// v0.0.0
// Created with <3 by Dawid Niedziółka @SZajbuS
// dniedziolka1997@gmail.com

import { configDotenv } from "dotenv";
import CustomClient from "./classes/CustomClient";
import 'dotenv/config';

configDotenv();

const client = new CustomClient();
client.init();

client.login(process.env.TOKEN);