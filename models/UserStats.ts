import { LevelStats, TierData } from "../domain/loungeFunctions"

class UserStats {
    nickanme: string
    titleString: string
    levelStats: LevelStats
    tier: TierData
    coins: number

    constructor(
        nickanme: string,
        titleString: string,
        levelStats: LevelStats,
        tier: TierData,
        coins: number
    ) {
        this.nickanme = nickanme
        this.titleString = titleString
        this.levelStats = levelStats
        this.tier = tier
        this.coins = coins
    }
}

export default UserStats