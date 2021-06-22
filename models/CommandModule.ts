import SlashCommand from "./SlashCommand";

class CommandModule {
    commands: SlashCommand[]

    constructor(
        commands: SlashCommand[]
    ) {
        this.commands = commands
    }
}

export default CommandModule