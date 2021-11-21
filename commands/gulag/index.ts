import CommandModule from "../../models/CommandModule";

import gulagMain from './gulagMain'

const moduleList = new CommandModule(
    [
        gulagMain
    ]
)

export default moduleList