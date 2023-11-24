import { ICommand } from "src/interfaces/ICommand";

const command: ICommand = {
    meta: {
        name: 'ping',
        aliases: ['pong'],
        description: 'Replies with Pong!',
    },
    async execute(context: any) {

    }
}

export default command;