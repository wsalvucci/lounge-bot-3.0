import { LevelStats, TierData } from "../domain/loungeFunctions"

class UserStats {
    nickanme: string
    titleString: string
    levelStats: LevelStats
    tier: TierData
    coins: number
    atk: number
    def: number
    matk: number
    mdef: number
    agi: number
    hp: number
    cha: number
    respecTimestamp: number
    specPoints: number

    constructor(
        nickanme: string,
        titleString: string,
        levelStats: LevelStats,
        tier: TierData,
        coins: number,
        atk: number,
        def: number,
        matk: number,
        mdef: number,
        agi: number,
        hp: number,
        cha: number,
        respecTimestamp: number,
        specPoints: number
    ) {
        this.nickanme = nickanme
        this.titleString = titleString
        this.levelStats = levelStats
        this.tier = tier
        this.coins = coins
        this.atk = atk
        this.def = def
        this.matk = matk
        this.mdef = mdef
        this.agi = agi
        this.hp = hp
        this.cha = cha
        this.respecTimestamp = respecTimestamp
        this.specPoints = specPoints
    }
}

export default UserStats