import betsApi from "../../api/bets/betsApi";
import Bet from "../../models/bets/Bet";

export default function getBetsUseCase(timestamp: number, repository: typeof betsApi) : Promise<Bet[]> {
    return repository.getBets(Math.floor(timestamp))
}