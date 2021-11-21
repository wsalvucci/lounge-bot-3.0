class SlapResponseLine {
    responseId: number
    personalityId: number
    responseType: number
    responseText: string

    constructor(
        responseId: number,
        personalityId: number,
        responseType: number,
        responseText: string
    ) {
        this.responseId = responseId
        this.personalityId = personalityId
        this.responseType = responseType
        this.responseText = responseText
    }

    static toDomainModel(data: any) : SlapResponseLine {
        return new SlapResponseLine(
            data.responseId,
            data.personalityId,
            data.responseType,
            data.responseText
        )
    }
}

export default SlapResponseLine