import CommandModule from "../../models/CommandModule";

import accuse from './accuse'

const moduleList = new CommandModule(
    [
        accuse
    ]
)

export default moduleList