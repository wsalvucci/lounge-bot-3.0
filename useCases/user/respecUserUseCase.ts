import loungeApi from "../../api/loungeApi";
import incrementUserStatUseCase from "./incrementUserStatUseCase";
import setUserPropertyUseCase from "./setUserPropertyUseCase";

export default function respecUserUseCase(discordId: string, atk: number, def: number, matk: number, mdef: number, agi: number, hp: number, cha: number, cost: number, pointsReturned: number, timestamp: number, repository: typeof loungeApi) {
    setUserPropertyUseCase(discordId, 'atk', atk, loungeApi)
    setUserPropertyUseCase(discordId, 'def', def, loungeApi)
    setUserPropertyUseCase(discordId, 'matk', matk, loungeApi)
    setUserPropertyUseCase(discordId, 'mdef', mdef, loungeApi)
    setUserPropertyUseCase(discordId, 'agi', agi, loungeApi)
    setUserPropertyUseCase(discordId, 'hp', hp, loungeApi)
    setUserPropertyUseCase(discordId, 'cha', cha, loungeApi)

    incrementUserStatUseCase(discordId, 'coins', -cost, loungeApi)

    setUserPropertyUseCase(discordId, 'respecTimestamp', timestamp, loungeApi)

    setUserPropertyUseCase(discordId, 'specPoints', pointsReturned, loungeApi)
}