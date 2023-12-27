// U B O J N I About Discord bot
// v0.0.0
// Created with <3 by Dawid Niedziółka @SZajbuS
// dniedziolka1997@gmail.com

import { configDotenv } from "dotenv";
import CustomClient from "./classes/CustomClient";
import 'dotenv/config';
import mongoose from "mongoose";
configDotenv();

const start = async () => {
    if (!process.env.DB_URL) {
        console.log('No database data in .env');
        process.exit(1);
    }

    await mongoose.connect(process.env.DB_URL).then( () => {
        console.log('Database connected');
    })
    .catch( err => {
        console.log(err);
        process.exit(1);
    })

    const client = new CustomClient();
    client.login(process.env.TOKEN);
}

start();
