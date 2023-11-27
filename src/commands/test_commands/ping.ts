import { ICommand } from "src/interfaces/ICommand";

export const command: ICommand = {
    meta: {
        name: 'ping',
        aliases: ['pong'],
        description: 'Replies with Pong!',
    },
    async execute(context: any) {

    }
}