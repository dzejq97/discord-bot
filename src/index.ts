// U B O J N I About Discord bot
// v0.0.0
// Created with <3 by Dawid Niedziółka @SZajbuS
// dniedziolka1997@gmail.com

import CustomClient from "./classes/CustomClient";
import { Token } from './config.json'


const client = new CustomClient();
client.init();

for (let level = 1; level < 10; level++) {
    const exp_second_lvl = 10;
    const exp_third_lvl = 20
    const step = exp_third_lvl - exp_second_lvl;
    const exp_per_msg = 5;

    const next_lvl = (step*level)*2

    console.log(`${level} => ${level + 1}: ${next_lvl}`);
}

//client.login(Token);