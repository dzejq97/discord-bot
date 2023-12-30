import * as Canvas from "@napi-rs/canvas";
import { AttachmentBuilder, Guild } from "discord.js";
import { join } from "node:path";
import CustomClient from "./CustomClient";
import { GuildMember, User } from "discord.js";
import { request } from "undici";

export default class CanvasManager {
    client: CustomClient;
    constructor (client: CustomClient) {
        this.client = client;

        Canvas.GlobalFonts.registerFromPath(join(__dirname, "..", "dependencies", "trebuc.ttf"), 'Trebuchet MS');
    }

    async getUserProfileBanner(member: GuildMember | User, guild: Guild): Promise<AttachmentBuilder | null> {
        if (!member) return null;
        
        let bg, avatar, percent, user, user_data;

        if (member instanceof GuildMember) user = member.user;
        else user = member;

        try {
            user_data = await this.client.mongo.Member.findOne({
                id: member.id,
                guild_id: guild.id,
            });
            if (!user_data) return null;

            bg = await Canvas.loadImage("src/dependencies/bg1.jpg");

            const { body } = await request(member.displayAvatarURL({ extension: 'jpg' }));
            avatar = await Canvas.loadImage(await body.arrayBuffer());
            //avatar = await Canvas.loadImage(member.displayAvatarURL({extension: 'jpg'}));

            percent = user_data.xp / user_data.req_xp;

        } catch (error) {
            this.client.logger.error(String(error));
            return null;
        }

        const canvas = Canvas.createCanvas(736, 345);
        const ctx = canvas.getContext("2d");    
        
        // Background
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        ctx.save();
    
        // avatar background
        ctx.beginPath();
        ctx.arc(125, 125, 105, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip()
        let grd = ctx.createLinearGradient(25, 25, 210, 210);
        grd.addColorStop(0, "rgb(240, 55, 178)");
        grd.addColorStop(1, 'rgb(91, 99, 218)');
        ctx.fillStyle = grd;
        ctx.fillRect(10, 10, 220, 250);
    
        // Avatar
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 25, 25, 200, 200);
        ctx.restore();
    
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        // Username
        grd = ctx.createLinearGradient(250, 250, canvas.width, canvas.height);
        grd.addColorStop(0, "rgb(194, 25, 128)");
        grd.addColorStop(1, 'rgb(51, 59, 168)');
    
        ctx.font = 'bold 35px Trebuchet MS';
        ctx.strokeStyle = grd;
        ctx.fillStyle = 'rgb(240, 240, 240)'
        ctx.strokeText(`${member.displayName}`, 240, 90);
        ctx.fillText(`${member.displayName}`, 240, 90);
    
        // Reputation
        ctx.font = "30px Trebuchet MS";
        ctx.fillStyle = 'rgb(240, 240, 240)';
        ctx.fillText('Reputation', 240, 130);
    
        // Reputation value
        ctx.font = "bold 35px Trebuchet MS"
        ctx.fillText(`${user_data.reputation}`, 400, 130);
    
        // Level
        ctx.font = "30px Trebuchet MS";
        ctx.fillText('Level', 240, 170);
    
        // Level value
        ctx.font = "bold 35px Trebuchet MS";
        ctx.fillText(`${user_data.level}`, 400, 170);
    
        // Level bar bg
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(60, 270, canvas.width - 120, 30)
    
        // level bar
        grd = ctx.createLinearGradient(50, 260, canvas.width - 100, 30);
        grd.addColorStop(0, "rgb(240, 55, 178)");
        grd.addColorStop(1, 'rgb(91, 99, 218)');
        ctx.fillStyle = grd;
        //const percent = 0.5
        ctx.fillRect(60, 270, (canvas.width - 120) * percent, 30);
    
        // xp points
        ctx.font = "25px Trebuchet MS";
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillText(`${user_data.xp}/${user_data.req_xp}xp`, 550, 294);
    
        //const png = await canvas.encode('png');
        const png = await canvas.encode('png');
        const attachment = new AttachmentBuilder(png, {name: 'profile-image.jpg'});
        return attachment;

        //DEBUG: save to file
        //await promises.writeFile(join(__dirname, 'test.png'), png);

    }
} 