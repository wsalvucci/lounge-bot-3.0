import CommandModule from "../../models/CommandModule";

import stats from './stats'
import nickname from './nickname'
import leaderboard from './leaderboard'

const moduleList = new CommandModule(
    [
        stats,
        nickname,
        leaderboard
    ]
)

export default moduleList