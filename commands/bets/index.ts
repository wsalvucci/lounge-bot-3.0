import CommandModule from "../../models/CommandModule";

import activeBets from './activeBets'
import getBet from './getBet'
import placeBet from './placeBet'

const moduleList = new CommandModule(
    [
        activeBets,
        getBet,
        placeBet
    ]
)

export default moduleList