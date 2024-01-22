import Module from "../../classes/Module";

class Core extends Module {
    constructor() {
        super();
        this.meta = {
            moduleDir: 'modules/core',
            name: 'Core',
            description: 'Core features',
            toggleable: false,
        }
    }
}

module.exports = new Core();