import { ICommand } from "src/interfaces/ICommand";
import CommandContext from "src/classes/CommandContext";
import * as Canvas from "@napi-rs/canvas"
import { AttachmentBuilder } from "discord.js";
import { promises } from "fs";
import { join } from "path";

export const command: ICommand = {
    meta: {
        name: "profile",
        aliases: ["p", "profil", "prof"],
        cooldown: {
            name: "CMD_profile",
            time: "5s",
            feedback_message: true,
            database_save: false,
        }
    },
    async execute(context: CommandContext) {
        if (!await context.canExecute()) return;

        let img;
        if (context.message.member && context.message.guild)
            img = await context.client.canvas.getUserProfileBanner(context.message.member, context.message.guild);
        else return;

        if (!img) return;
        
        await context.message.reply({files: [img]});
    }
}