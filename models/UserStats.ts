import { LevelStats, TierData } from "../domain/loungeFunctions"

class UserStats {
    nickanme: string
    titleString: string
    levelStats: LevelStats
    tier: TierData

    constructor(
        nickanme: string,
        titleString: string,
        levelStats: LevelStats,
        tier: TierData
    ) {
        this.nickanme = nickanme
        this.titleString = titleString
        this.levelStats = levelStats
        this.tier = tier
    }
}

export default UserStats