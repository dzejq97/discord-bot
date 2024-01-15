import path from "node:path";
import fs from "node:fs";
import UClient from "./UClient";
import chalk from "chalk";


export class Logger {
    client: UClient | undefined;
    logsDir = path.join(__dirname, '../logs/');
    private logStream;

    constructor(client?: UClient) {
        if( client ) {
            this.client = client;
        }
        if(!fs.existsSync(this.logsDir)) {
            fs.mkdir(this.logsDir, (err) => {
                if (err) {
                    this.error('Creating logs directory failed', true);
                }
            });
        }
        this.logStream = fs.createWriteStream(path.join(this.logsDir, this.timestamp() + '.log'), { flags: 'w'});
    }

    timestamp(): string {
        return new Date().toLocaleString();
    }

    info(message: string) {
        let str = `${this.timestamp()}|INFO: ${message}\r\n`;
        this.logStream.write(str);
        if (this.client?.verbose) {
            str = `${this.timestamp()} INFO: ${message}`;
            console.log(str);
        }
    }

    success(message: string) {
        let str = `${this.timestamp()}|SUCCESS: ${message}\r\n`;
        this.logStream.write(str);
        str = `${this.timestamp()} ${chalk.green('SUCCESS')} ${message}`;
        console.log(str);
    }

    error(error: any, fatal?: boolean) {
        let errorMessage: string;
        if (typeof error === 'string')
            errorMessage = error;
        else if (error instanceof Error)
            errorMessage = error.message;
        else
            errorMessage = String(error);

        let str = `${this.timestamp()}|ERROR: ${errorMessage}\r\n`;
        this.logStream.write(str);
        str = `${this.timestamp()} ${chalk.black.bgRed('ERROR')} ${errorMessage}`;
        console.log(str);
        if (fatal) {
            str = chalk.black.bgRed('FATAL ERROR') + 'script is executed due to fatal error';
            console.log(str);
            process.exit();
        }
    }
}

module.exports = new Logger();
