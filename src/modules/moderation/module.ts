import { Model, Schema } from "mongoose";
import Module from "../../classes/Module";
import { IKick } from "./models/kicks";
import { IBan } from "./models/bans";
import { IWarn } from "./models/warns";

interface IModerationConfig {
    enabled: boolean;
}

class Moderation extends Module {
    KicksModel: Model<IKick> = require('./models/kicks');
    BansModel: Model<IBan> = require('./models/bans');
    WarnsModel: Model<IWarn> = require('./models/warns');
    
    constructor() {
        super();
        this.meta = {
            moduleDir: 'modules/moderation',
            name: 'Moderation',
            description: 'lorem ipsum',
            toggleable: true,
        }
        this.default_config = <IModerationConfig>{
            enabled: true,
        }
    }
}

module.exports = new Moderation();
