import CommandModule from "../../models/CommandModule";

import accuse from './accuse'
import vote from './vote'

const moduleList = new CommandModule(
    [
        accuse,
        vote
    ]
)

export default moduleList