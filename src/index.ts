import { configDotenv } from "dotenv";
import { Logger } from "./classes/Logger";
configDotenv();

import mongoose from "mongoose";
import UClient from "./classes/UClient";
const log: Logger = require('./classes/Logger')


const start = async() => {
    if (!process.env.DB_URL) return console.log('Provide database URL in .env file');
    /*if (!process.env.TOKEN) {
        console.log('Provide discord token in .env file');
        process.exit();
    }*/
    
    log.info('Connecting MongoDB')
    await mongoose.connect(process.env.DB_URL).then( () => {
        log.success('MongoDB connected')
    })
    .catch( err => {
        log.error(err, true);
    })

    const client = new UClient();
    await client.run();
}

try {
    start();
} catch(err) {
    log.error(err, true);
}