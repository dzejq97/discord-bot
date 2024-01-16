import ICommand from "src/interfaces/ICommand"
import CommandContext from "src/classes/CommandContext"

module.exports = <ICommand>{
    meta: {
        name: 'ping',
        aliases: ['pong'],
    },
    async execute(context: CommandContext) {
        if (context.used_alias === 'ping') {
            context.respond('pong');
        } else {
            context.respond('ping');
        }
    }
}