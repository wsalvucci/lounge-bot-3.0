import CommandModule from "../../models/CommandModule";

import activeBets from './activeBets'
import getBet from './getBet'
import placeBet from './placeBet'
import checkBet from './checkBet'
import checkAllBets from './checkAllbets'
import deleteBet from './deleteBet'

const moduleList = new CommandModule(
    [
        activeBets,
        getBet,
        placeBet,
        checkBet,
        checkAllBets,
        deleteBet
    ]
)

export default moduleList