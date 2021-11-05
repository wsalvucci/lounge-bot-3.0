import CommandModule from "../../models/CommandModule";

import stats from './stats'
import nickname from './nickname'
import leaderboard from './leaderboard'
import color from './color'
import createAccount from './createAccount'
import personalRecords from './personalRecords'
import spec from './spec'
import respec from './respec'

const moduleList = new CommandModule(
    [
        stats,
        nickname,
        leaderboard,
        color,
        createAccount,
        personalRecords,
        spec,
        respec
    ]
)

export default moduleList