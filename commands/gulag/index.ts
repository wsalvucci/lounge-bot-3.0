import CommandModule from "../../models/CommandModule";

import accuse from './accuse'
import vote from './vote'
import bribe from './bribe'
import removeBribe from './removeBribe'
import checkBribe from './checkBribe'
import mine from './mine'
import checkGulag from './checkGulag'

const moduleList = new CommandModule(
    [
        accuse,
        vote,
        bribe,
        removeBribe,
        checkBribe,
        mine,
        checkGulag
    ]
)

export default moduleList