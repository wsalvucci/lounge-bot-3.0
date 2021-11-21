import betsApi from "../../api/bets/betsApi";
import UserBet from "../../models/bets/UserBet";

export default function getUserBetOptionUseCase(userId: string, betId: number, repository: typeof betsApi) : Promise<UserBet> {
    return repository.getUserBet(userId, betId)
}