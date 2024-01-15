import UClient from "../../classes/UClient"
import Module from "../../classes/Module";



class Moderation extends Module {
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
