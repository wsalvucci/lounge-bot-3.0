import { OrderType } from "../domain/loungeFunctions";
import LoungeUser from "../models/LoungeUser";
import { LeaderboardResponse } from "../models/response/LeaderboardResponse";
import { PersonalRecordsResponse } from "../models/response/PersonalRecordsResponse";
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

    async setUserProperty(discordId: string, propertyName: string, value: string | number) : Promise<SqlResponse> {
        return apiCall(`/updateUser?discordId=${discordId}&propertyName=${propertyName}&value=${value}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async createAccount(discordId: string, name: string, timeAdded: number) : Promise<SqlResponse> {
        return apiCall(`/createUser?discordId=${discordId}&name=${name}&timeAdded=${timeAdded}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getPersonalRecords(discordId: string) : Promise<PersonalRecordsResponse> {
        return apiCall(`/personalRecords?discordId=${discordId}`)
            .then((data: any) => PersonalRecordsResponse.parseData(data))
    }
}

export default new TheLoungeApi