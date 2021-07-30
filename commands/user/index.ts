import CommandModule from "../../models/CommandModule";
import SlashCommand from "../../models/SlashCommand";

import stats from './stats'
import nickname from './nickname'

const moduleList = new CommandModule(
    [
        stats,
        nickname
    ]
)

export default moduleList