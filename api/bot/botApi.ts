import BotPersonality from "../../models/bot/BotPersonality";
import Guild from "../../models/bot/Guild";
import SqlResponse from "../../responseModels/SqlResponse";
import apiCall from "../apiCall"

class BotApi {
    async getPersonalities() : Promise<BotPersonality[]> {
        return apiCall(`/bot/personalities`)
            .then((data: any) => {
                var personalityList: BotPersonality[] = []
                data.forEach((personality: any) => {
                    personalityList.push(BotPersonality.toDomainModel(personality))
                });
                return personalityList
            })
    }

    async getCurrentPersonality() : Promise<BotPersonality> {
        return apiCall('/bot/getPersonality')
            .then((data: any) => BotPersonality.toDomainModel(data))
    }

    async updatePersonality(id: number) : Promise<SqlResponse> {
        return apiCall(`/bot/updatePersonality?personalityId=${id}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getGuild(id: string) : Promise<Guild> {
        return apiCall(`/bot/guild?guildId=${id}`)
            .then((data: any) => Guild.toDomainModel(data[0]))
    }

    async getPersonalityIntros(id: number) : Promise<string[]> {
        return apiCall(`/bot/intoLines?personalityId=${id}`)
            .then((data: any) => {
                var lines : string[] = []
                data.forEach((lineData : any) => {
                    lines.push(lineData.line)
                });
                return lines
            })
    }
}

export default new BotApi