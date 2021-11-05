import Bribe from "../../models/gulag/Bribe"
import Trial from "../../models/gulag/Trial"
import SqlResponse from "../../responseModels/SqlResponse"
import apiCall from "../apiCall"

class GulagApi {
    async addTrial(accuserId: string, targetId: string, accusation: string, timestamp: number, judgeType: number): Promise<SqlResponse> {
        return apiCall(`/gulag/addTrial?accuserId=${accuserId}&targetId=${targetId}&accusation=${accusation}&timestamp=${timestamp}&judgeType=${judgeType}`)
            .then((data: any ) => SqlResponse.dataToModel(data))
    }

    async addTrialVote(trialId: number, voterId: string, vote: number): Promise<SqlResponse> {
        return apiCall(`/gulag/addTrialVote?trialId=${trialId}&voterId=${voterId}&vote=${vote}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getTrial(trialId: number): Promise<Trial> {
        return apiCall(`/gulag/getTrial?trialId=${trialId}`)
            .then((data: any) => Trial.toDomainModel(data[0]))
    }

    async getActiveTrials(): Promise<Trial[]> {
        return apiCall(`/gulag/getActiveTrials`)
            .then((data: any) => {
                var trialList : Trial[] = []
                data.forEach((trial: Trial) => {
                    trialList.push(Trial.toDomainModel(trial))
                });
                return trialList
            })
    }

    async getTrialBribes(trialId: number): Promise<Bribe[]> {
        return apiCall(`/gulag/getTrialBribes?trialId=${trialId}`)
            .then((data: any) => {
                var bribeList : Bribe[] = []
                data.forEach((bribe: Bribe) => {
                    bribeList.push(Bribe.toDomainModel(bribe))
                });
                return bribeList
            })
    }

    async addTrialBribe(trialId: number, discordId: string, amount: number, vote: number) : Promise<SqlResponse> {
        return apiCall(`/gulag/addTrialBribe?trialId=${trialId}&discordId=${discordId}&amount=${amount}&vote=${vote}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async removeTrialBribe(trialId: number, discordId: string) : Promise<SqlResponse> {
        return apiCall(`/gulag/removeTrialBribe?trialId=${trialId}&discordId=${discordId}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }
}

export default new GulagApi