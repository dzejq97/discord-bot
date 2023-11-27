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

    info(msg: string) {
        let str = `${this.timestamp()}|INFO: ${msg}`;
        this.WriteFile.write(str);
        str = `${chalk.gray(this.timestamp())} ${chalk.gray('INFO')} ${msg}`;
        console.log(str);
    }

    success(msg: string) {
        let str = `${this.timestamp()}|SUCCESS: ${msg}`;
        this.WriteFile.write(str);
        str = `${chalk.gray(this.timestamp())} ${chalk.green('SUCCESS')} ${msg}`;
        console.log(str);
    }

    failed(msg: string) {
        let str = `${this.timestamp()}|FAILED: ${msg}`;
        this.WriteFile.write(str);
        str = `${chalk.gray(this.timestamp())} ${chalk.yellow('FAILED')} ${msg}`;
        console.log(str);
    }

    error(msg: string) {
        let str = `${this.timestamp()}|ERROR: ${msg}`;
        this.WriteFile.write(str);
        str = `${chalk.gray(this.timestamp())} ${chalk.red('ERROR')} ${msg}`;
        console.log(str);
    }
}