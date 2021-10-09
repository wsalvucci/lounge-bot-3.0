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
}

export default new GulagApi