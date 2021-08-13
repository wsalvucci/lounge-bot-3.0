import TheLoungeApi from "../../api/loungeApi";
import { OrderType, UserStat } from "../../domain/loungeFunctions";
import { LeaderboardResponse } from "../../models/response/LeaderboardResponse";

export default function getStatLeaderboardUseCase(statName: UserStat, order: OrderType, repository: typeof TheLoungeApi) : Promise<LeaderboardResponse> {
    return repository.getLeaderboard(statName, order)
}