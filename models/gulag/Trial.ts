class Trial {
    id: number
    accuserId: string
    targetId: string
    accusation: string
    timestamp: number
    concluded: number
    judgeType: number

    constructor(
        id: number,
        accuserId: string,
        targetId: string,
        accusation: string,
        timestamp: number,
        concluded: number,
        judgeType: number
    ) {
        this.id = id
        this.accuserId = accuserId
        this.targetId = targetId
        this.accusation = accusation
        this.timestamp = timestamp
        this.concluded = concluded
        this.judgeType = judgeType
    }

    static toDomainModel(data: any) : Trial {
        return new Trial(
            data.trialId,
            data.accuserId,
            data.targetId,
            data.accusation,
            data.timestamp,
            data.concluded,
            data.judgeType
        )
    }
}

export default Trial