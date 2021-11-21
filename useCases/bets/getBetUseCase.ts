import betsApi from "../../api/bets/betsApi";
import Bet from "../../models/bets/Bet";


export default function getBetUseCase(betId: number, repository: typeof betsApi) : Promise<Bet> {
    return repository.getBet(betId)
}