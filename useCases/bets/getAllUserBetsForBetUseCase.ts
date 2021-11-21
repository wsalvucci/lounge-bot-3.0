import betsApi from "../../api/bets/betsApi";
import UserBet from "../../models/bets/UserBet";

export default function getAllUserBetsForBetUseCase(betId: number, repository: typeof betsApi) : Promise<UserBet[]> {
    return repository.getAllUserBetsForBet(betId)
}