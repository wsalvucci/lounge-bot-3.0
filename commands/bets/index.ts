import CommandModule from "../../models/CommandModule";

import betsMain from './betsMain'

const moduleList = new CommandModule(
    [
        betsMain
    ]
)

export default moduleList