import Bribe from "../../models/gulag/Bribe"
import Gulag from "../../models/gulag/Gulag"
import Trial from "../../models/gulag/Trial"
import TrialVote from "../../models/gulag/Vote"
import SqlResponse from "../../responseModels/SqlResponse"
import apiCall from "../apiCall"

class GulagApi {
    async addTrial(guildId: string, accuserId: string, targetId: string, accusation: string, timestamp: number, judgeType: number): Promise<SqlResponse> {
        return apiCall(`/gulag/addTrial?guildId=${guildId}&accuserId=${accuserId}&targetId=${targetId}&accusation=${accusation}&timestamp=${timestamp}&judgeType=${judgeType}`)
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

    async concludeTrial(trialId: number): Promise<SqlResponse> {
        return apiCall(`/gulag/concludeTrial?trialId=${trialId}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getTrialVotes(trialId: number): Promise<TrialVote[]> {
        return apiCall(`/gulag/getTrialVotes?trialId=${trialId}`)
            .then((data: any) => {
                var trialVotes : TrialVote[] = []
                data.forEach((vote: any) => {
                    trialVotes.push(TrialVote.toDomainModel(vote))
                });
                return trialVotes
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

    async gulagUser(userId: string, attackerId: string, timestamp: number, points: number): Promise<SqlResponse> {
        return apiCall(`/gulag/gulagUser?userId=${userId}&attackerId=${attackerId}&timestamp=${timestamp}&points=${points}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async unGulagUser(userId: string) : Promise<SqlResponse> {
        return apiCall(`/gulag/unGulagUser?userId=${userId}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async mineGulag(userId: string, points: number): Promise<SqlResponse> {
        return apiCall(`/gulag/mineGulag?userId=${userId}&points=${points}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getActiveGulags(): Promise<Gulag[]> {
        return apiCall(`/gulag/activeGulags`)
            .then((data: any) => {
                var gulagList : Gulag[] = []
                data.forEach((gulag: Gulag) => {
                    gulagList.push(Gulag.toDomainModel(gulag))
                });
                return gulagList
            })
    }
}

export default new GulagApi