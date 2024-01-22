import CommandContext from "src/classes/CommandContext";
import ICommand from "src/interfaces/ICommand";

module.exports = <ICommand>{
    meta: {
        name: 'setprefix',
        aliases: ['prefix'],
        arguments: ['<string>'],
        autodelete_reply_message: true,
        autodelete_trigger_message: true,
        requirements: {
            only_guild_administrator: true,
        }
    },
    async execute(context: CommandContext) {
        console.log('sub');
    },
}