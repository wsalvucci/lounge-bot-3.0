import { OrderType } from "../domain/loungeFunctions";
import LoungeUser from "../models/LoungeUser";
import { LeaderboardResponse } from "../models/response/LeaderboardResponse";
import UserTitle from "../models/UserTitle";
import SqlResponse from "../responseModels/SqlResponse";

const fetch = require("node-fetch")
const endpoint = process.env.API_ENDPOINT

function apiCall(path: string) {
    return new Promise(function(resolve, reject) {
        fetch(`${endpoint}${path}`)
            .then((res: { json : () => any}) => res.json())
            .then((json: string) => {resolve(json)})
            .catch((err: any) => reject(err))
    })
}

class TheLoungeApi {
    async getUser(discordId: string): Promise<LoungeUser> {
        return apiCall(`/user/${discordId}`)
            .then((data: any) => LoungeUser.toDomainModel(data[0]))
    }

    async getTitle(titleId: number): Promise<UserTitle> {
        return apiCall(`/title/${titleId}`)
            .then((data: any) => UserTitle.toDomainModel(data[0]))
    }

    async setNickname(discordId: string, nickname: string) : Promise<SqlResponse> {
        return apiCall(`/updateUser?discordId=${discordId}&nickname=${nickname}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getLeaderboard(statName: string, order: OrderType) : Promise<LeaderboardResponse> {
        return apiCall(`/leaderboard/${statName}?order=${order}`)
            .then((data: any) => LeaderboardResponse.dataToResponse(data, statName))
    }
}

export default new TheLoungeApi