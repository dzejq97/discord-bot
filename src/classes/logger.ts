import chalk from "chalk";

import fs from 'node:fs';
import { WriteStream } from "node:fs";

export default class Logger {
    WriteFile:WriteStream;
    constructor() {
        this.WriteFile = fs.createWriteStream('./debug.log', {flags: 'w'});
    }

    timestamp(): string {
        return new Date().toLocaleString()
    }

    log(msg: string) {
        this.WriteFile.write(`${this.timestamp()}: ${msg}\n`)
        console.log(`${chalk.gray(this.timestamp())} ${msg}`);
    }

    success(msg: string) {
        let str = `${this.timestamp()} SUCCESS: ${msg}`;
        this.WriteFile.write(str);
        str = `${chalk.gray(this.timestamp())} ${chalk.bgGreen('SUCCESS')} ${msg}`;
        console.log(str);
    }

    failed(msg: string) {
        let str = `${this.timestamp()} FAILED: ${msg}`;
        this.WriteFile.write(str);
        str = `${chalk.gray(this.timestamp())} ${chalk.bgYellow('FAILED')} ${msg}`;
        console.log(str);
    }

    error(msg: string) {
        let str = `${this.timestamp()} ERROR: ${msg}`;
        this.WriteFile.write(str);
        str = `${chalk.gray(this.timestamp())} ${chalk.bgRed('ERROR')} ${msg}`;
        console.log(str);
    }
}