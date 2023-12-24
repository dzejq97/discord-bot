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
            time: "5s"
        }
    },
    async execute(context: CommandContext) {
        if (await context.cooldown(this)) return;

        let img;
        if (context.message.member)
            img = await context.client.canvas.getUserProfileBanner(context.message.member);
        else return;

        if (!img) return;
        
        await context.message.reply({files: [img]});
    }
}