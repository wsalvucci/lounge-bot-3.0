import CommandModule from "../../models/CommandModule";

import userMain from './userMain'

const moduleList = new CommandModule(
    [
        userMain
    ]
)

export default moduleList