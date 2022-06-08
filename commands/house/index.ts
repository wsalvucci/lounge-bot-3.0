import CommandModule from "../../models/CommandModule";
import houseMain from './houseMain'

const moduleList = new CommandModule(
    [
        houseMain
    ]
)

export default moduleList