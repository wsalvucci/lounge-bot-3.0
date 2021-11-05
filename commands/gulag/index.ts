import CommandModule from "../../models/CommandModule";

import accuse from './accuse'
import vote from './vote'
import bribe from './bribe'
import removeBribe from './removeBribe'
import checkBribe from './checkBribe'

const moduleList = new CommandModule(
    [
        accuse,
        vote,
        bribe,
        removeBribe,
        checkBribe
    ]
)

export default moduleList