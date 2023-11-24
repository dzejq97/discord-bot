import MainClient from "./main_client";

import path from "node:path";
import fs from "node:fs";

const client = new MainClient();

//Loading events files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.logger.log('wczytywanie twojej starej');
client.logger.success('twoja stara załadowana');
client.logger.log('wczytywanie twojego starego');
client.logger.failed('błąd podczas wczytywania twojego starego');
client.logger.error('twój stary leży najebany na wersalce')

