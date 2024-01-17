import { Model } from "mongoose";
import Module from "../../classes/Module";
import { IKick } from "./models/kicks";
import { IBan } from "./models/bans";

class Moderation extends Module {
    KicksModel: Model<IKick> = require('./models/kicks');
    BansModel: Model<IBan> = require('./models/bans');
    
    constructor() {
        super();
        this.meta = {
            moduleDir: 'modules/moderation',
            name: 'Moderation',
            description: 'lorem ipsum',
            toggleable: true,
        }
    }
}

module.exports = new Moderation();
