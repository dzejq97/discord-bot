import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import { PermissionFlagsBits } from "discord.js";

export const command: ICommand = {
    meta: {
        name: "ban",
        aliases: ["b"],
        requiredPermissions: [PermissionFlagsBits.BanMembers],
        arguments_format: "<member> [multi_string]"
    },

    async execute(context: CommandContext) {
        if (!context.verifyAuthorPermissions(this.meta.requiredPermissions))
            return;
        if (!context.parseArguments(this.meta.arguments_format))
            return;
    }
}