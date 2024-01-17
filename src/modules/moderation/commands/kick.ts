import ICommand from "src/interfaces/ICommand"
import CommandContext from "src/classes/CommandContext"

module.exports = <ICommand>{
    meta: {
        name: 'kick',
        autodelete_reply_message: false,
        autodelete_trigger_message: true,
        requirements: {
            only_guild_moderator: true,
        }
    },
    async execute(context: CommandContext) {
        //
    }
}