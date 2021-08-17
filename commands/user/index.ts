import CommandModule from "../../models/CommandModule";

import stats from './stats'
import nickname from './nickname'
import leaderboard from './leaderboard'
import color from './color'

const moduleList = new CommandModule(
    [
        stats,
        nickname,
        leaderboard,
        color
    ]
)

export default moduleList