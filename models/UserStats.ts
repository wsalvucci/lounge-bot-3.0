import { LevelStats, TierData } from "../domain/loungeFunctions"

class UserStats {
    username: string
    nickname: string
    house: number
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
    accusationTimestamp: number

    constructor(
        username: string,
        nickanme: string,
        house: number,
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
        specPoints: number,
        accusationTimestamp: number
    ) {
        this.username = username
        this.nickname = nickanme
        this.house = house
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
        this.accusationTimestamp = accusationTimestamp
    }
}

export default UserStats