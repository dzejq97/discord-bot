
export default class ComandArgument {
    argument: string;

    constructor(argument: string) {
        this.argument = argument
    }

    isMemberMention(): boolean {
        if (this.argument.startsWith("<@") && this.argument.endsWith(">")) return true;
        return false;
    }

    isRoleMention(): boolean {
        if (this.argument.startsWith("<@&") && this.argument.endsWith(">")) return true;
        return false;
    }
    isChannelMention(): boolean {
        if (this.argument.startsWith("<#") && this.argument.endsWith(">")) return true;
        return false;
    }
}