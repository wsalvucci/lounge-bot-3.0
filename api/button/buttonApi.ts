import ButtonRound from "../../models/button/ButtonRound";
import UserButton from "../../models/button/UserButton";
import SqlResponse from "../../responseModels/SqlResponse";
import apiCall from "../apiCall";

class ButtonApi {
    async takeAction(discordId: string, action: number, timestamp: number, targetId: string, roundTime: number, roundTimeLeft: number, breakButton: number) : Promise<SqlResponse> {
        return apiCall(`/button/takeAction?discordId=${discordId}&action=${action}&timestamp=${timestamp}&targetId=${targetId}&roundTime=${roundTime}&roundTimeLeft=${roundTimeLeft}&breakButton=${breakButton}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getButton(discordId: string) : Promise<UserButton> {
        return apiCall(`/button/getButton?discordId=${discordId}`)
            .then((data: any) => {
                if (data[0] !== undefined) {
                    return UserButton.toDomainModel(data[0])
                } else {
                    return new UserButton("", -1, -1, -1, -1)
                }
            })
    }

    async getAllButtons() : Promise<UserButton[]> {
        return apiCall(`/button/getAllButtons`)
            .then((data: any) => {
                var buttonList : UserButton[] = []
                data.forEach((button: any) => {
                    buttonList.push(UserButton.toDomainModel(button))
                });
                return buttonList
            })
    }

    async startNewRound(guildId: string, roundStart: number, roundEnd: number) : Promise<SqlResponse> {

        return apiCall(`/button/startNewRound?guildId=${guildId}&roundStart=${roundStart}&roundEnd=${roundEnd}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getRound(guildId: string) : Promise<ButtonRound> {
        return apiCall(`/button/getRound?guildId=${guildId}`)
            .then((data: any) => {
                if (data[0] !== undefined) {
                    return ButtonRound.toDomainModel(data[0])
                } else {
                    return new ButtonRound("", -1, -1, -1)
                }
            })
    }

    async addScore(discordId: string, points: number) : Promise<SqlResponse> {
        return apiCall(`/button/addScore?discordId=${discordId}&points=${points}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }
}

export default new ButtonApi