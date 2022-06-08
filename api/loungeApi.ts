import { OrderType } from "../domain/loungeFunctions";
import House from "../models/house/House";
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
        return apiCall(`/user/getUser?discordId=${discordId}`)
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

    async incrementUserProperty(discordId: string, statName: string, amount: number) : Promise<SqlResponse> {
        return apiCall(`/incrementUserStat?discordId=${discordId}&statName=${statName}&amount=${amount}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async createAccount(discordId: string, name: string, timeAdded: number, house: number) : Promise<SqlResponse> {
        return apiCall(`/createUser?discordId=${discordId}&name=${name}&timeAdded=${timeAdded}&house=${house}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getPersonalRecords(discordId: string) : Promise<PersonalRecordsResponse> {
        return apiCall(`/personalRecords?discordId=${discordId}`)
            .then((data: any) => PersonalRecordsResponse.parseData(data))
    }

    async checkIfUserExists(discordId: string) : Promise<Boolean> {
        return apiCall(`/user/getUser?discordId=${discordId}`)
            .then((data: any) => {
                if (data.length == 0) {return false} else {return true}
            })
    }

    async getAllUsers() : Promise<LoungeUser[]> {
        return apiCall(`/user/getAllUsers`)
            .then((data: any) => {
                var userList : LoungeUser[] = []
                data.forEach((user: any) => {
                    userList.push(LoungeUser.toDomainModel(user))
                });
                return userList
            })
    }

    async addVoice(discordId: string, amount: number, xp: number) : Promise<SqlResponse> {
        return apiCall(`/user/addVoice?discordId=${discordId}&amount=${amount}&xp=${xp}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async addMessage(discordId: string, xp: number) : Promise<SqlResponse> {
        return apiCall(`/user/addMessage?discordId=${discordId}&xp=${xp}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async addPersonalRecord(discordId: string, timestamp: number, messages: number, voice: number) : Promise<SqlResponse> {
        return apiCall(`/user/addPersonalRecord?discordId=${discordId}&timestamp=${timestamp}&messages=${messages}&voice=${voice}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async addServerRecord(timestamp: number, messages: number, voice: number) : Promise<SqlResponse> {
        return apiCall(`/user/addServerRecord?timestamp=${timestamp}&messages=${messages}&voice=${voice}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getHouseDetails(houseId: number) : Promise<House> {
        return apiCall(`/house?id=${houseId}`)
            .then((data: any) => House.toDomainModel(data[0]))
    }

    async getAllHouseDetails() : Promise<House[]> {
        return apiCall(`/house/allHouses`)
            .then((data: any) => {
                var houseList: House[] = []
                data.forEach((house: any) => {
                    houseList.push(House.toDomainModel(house))
                });
                return houseList
            })
    }

    async addHousePointEvent(discordId: string, headmasterId: string, points: number, reason: string, houseId: number, timestamp: number) : Promise<SqlResponse> {
        return apiCall(`/house/addPointEvent?discordId=${discordId}&headmasterId=${headmasterId}&points=${points}&reason=${reason}&houseId=${houseId}&timestamp=${timestamp}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }
}

export default new TheLoungeApi