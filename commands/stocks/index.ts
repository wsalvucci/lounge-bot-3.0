import CommandModule from "../../models/CommandModule";

import stocksMain from './stocksMain'

const moduleList = new CommandModule(
    [
        stocksMain
    ]
)

export default moduleList