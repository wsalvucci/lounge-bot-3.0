import CommandModule from "../../models/CommandModule";

import shopMain from './shopMain'

const moduleList = new CommandModule(
    [
        shopMain
    ]
)

export default moduleList