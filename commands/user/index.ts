import CommandModule from "../../models/CommandModule";
import SlashCommand from "../../models/SlashCommand";

import stats from './stats'

const moduleList = new CommandModule(
    [
        stats
    ]
)

export default moduleList