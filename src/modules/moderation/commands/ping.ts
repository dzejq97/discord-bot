import ICommand from "src/interfaces/ICommand"
import CommandContext from "src/classes/CommandContext"

module.exports = <ICommand>{
    meta: {
        name: 'ping',
        aliases: ['pong'],
    },
    async execute(context: CommandContext) {

    }
}