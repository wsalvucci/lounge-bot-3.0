import CommandModule from "../../models/CommandModule";

import activeBets from './activeBets'
import getBet from './getBet'

const moduleList = new CommandModule(
    [
        activeBets,
        getBet
    ]
)

export default moduleList