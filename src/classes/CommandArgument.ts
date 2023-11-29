
export default class ComandArgument {
    content: string;

    constructor(argument: string) {
        this.content = argument
    }

    isMemberMention(): boolean {
        if (this.content.startsWith("<@") && this.content.endsWith(">")) return true;
        return false;
    }

    isRoleMention(): boolean {
        if (this.content.startsWith("<@&") && this.content.endsWith(">")) return true;
        return false;
    }
    isChannelMention(): boolean {
        if (this.content.startsWith("<#") && this.content.endsWith(">")) return true;
        return false;
    }
}