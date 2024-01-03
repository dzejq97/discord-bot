import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";

export const command: ICommand = {
    meta: {
        name: 'topbumps',
        aliases: ['bumptop', 'tb', 'bumpers', 'bumps'],
        cooldown: {
            name: 'CMD_topbumps',
            time: '20s',
            database_save: false,
        }
    },
    async execute(context: CommandContext) {
        const emb = context.client.embeds.empty();
        emb.setTitle('Top 10 bumpers:');

        let members;
        try {
            members = await context.mongo.Member.find({guild_id: context.guild?.id}).sort({bumps: -1}).limit(10);
        } catch (err) {
            return;
        }

        console.log(members);

        let str = "", i = 1;
        for (const member of members) {
            let m;
            try {
                m = await context.message.guild?.members.fetch(member.id);
            } catch (err) {
                console.log(err);
                return;
            }
            str += `**${i}**: ${m?.displayName} - **${member.bumps}** bumps\n`;
            i++;
        }

        emb.setDescription(str);
        await context.message.reply({embeds: [emb]});
    }
}