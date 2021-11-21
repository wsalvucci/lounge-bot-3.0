import Bet from "../../models/bets/Bet";
import BetOption from "../../models/bets/BetOption";
import UserBet from "../../models/bets/UserBet"
import SqlResponse from "../../responseModels/SqlResponse";
import apiCall from "../apiCall"

class BetApi {
    async getBets(timestamp: number) : Promise<Bet[]> {
        return apiCall(`/bets/getBets?timestamp=${timestamp}`)
            .then((data: any) => {
                var betList : Bet[] = []
                data.forEach((bet: Bet) => {
                    betList.push(Bet.toDomainModel(bet))
                });
                return betList
            })
    }

    async getBet(betId: number) : Promise<Bet> {
        return apiCall(`/bets/getBet?betId=${betId}`)
            .then((data: any) => Bet.toDomainModel(data[0]))
    }

    async addBet(betName: string, betDescription: string, openingTimestamp: number, closingTimestamp: number) : Promise<SqlResponse> {
        return apiCall(`/bets/addBet`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async updateBet(betId: number, betName: string, betDescription: string, openingTimestamp: number, closingTimestamp: number) : Promise<SqlResponse> {
        return apiCall(`/bets/updateBet`)
            .then((data: any) => SqlResponse.dataToModel(data))
        
    }

    async getBetOptions(betId: number) : Promise<BetOption[]> {
        return apiCall(`/bets/getBetOptions?betId=${betId}`)
            .then((data: any) => {
                var optionsList : BetOption[] = []
                data.forEach((option: BetOption) => {
                    optionsList.push(BetOption.toDomainModel(option))
                });
                return optionsList
            })
    }

    async getBetOption(betOptionId: number) : Promise<BetOption> {
        return apiCall(`/bets/getBetOption`)
            .then((data: any) => BetOption.toDomainModel(data[0]))
    }

    async addBetOption(betId: number, optionName: string, optionDescription: string, optionLine: number) : Promise<SqlResponse> {
        return apiCall(`/bets/addBetOption`)
            .then((data: any) => SqlResponse.dataToModel(data))
        
    }

    async updateBetOption(betId: number, optionName: string, optionDescription: string, optionLine: number) : Promise<SqlResponse> {
        return apiCall(`/bets/updateBetOption`)
            .then((data: any) => SqlResponse.dataToModel(data))
        
    }

    async getUserBets(userId: string) : Promise<UserBet[]> {
        return apiCall(`/bets/getUserBets`)
            .then((data: any) => {
                var userBets : UserBet[] = []
                data.forEach((userBet: UserBet) => {
                    userBets.push(UserBet.toDomainModel(userBet))
                });
                return userBets
            })
    }

    async getUserBet(userId: string, betId: number) : Promise<UserBet> {
        return apiCall(`/bets/getUserBet`)
            .then((data: any) => UserBet.toDomainModel(data[0]))
    }

    async placeBet(userId: string, betId: number, betSelection: number, betAmount: number) : Promise<SqlResponse> {
        return apiCall(`/bets/placeBet`)
            .then((data: any) => SqlResponse.dataToModel(data))
        
    }
}

export default new BetApi