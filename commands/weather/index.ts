import CommandModule from "../../models/CommandModule";

import weather from './weather'


const moduleList = new CommandModule(
    [
        weather
    ]
)

export default moduleList