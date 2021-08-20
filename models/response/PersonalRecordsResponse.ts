export class PersonalRecordsResponse {
    records: PersonalRecordResponse[]

    constructor(
        records: PersonalRecordResponse[]
    ) {
        this.records = records
    }

    static parseData(data: any) : PersonalRecordsResponse {
        var list : PersonalRecordResponse[] = []
        data.forEach((recordData : PersonalRecordResponse) => {
            list.push(
                PersonalRecordResponse.parseData(recordData)
            )
        });
        return new PersonalRecordsResponse(list)
    }
}

export class PersonalRecordResponse {
    recordId: number
    timestamp: number
    discordId: string
    totalMessage: number
    totalVoice: number

    constructor(
        recordId: number,
        timestamp: number,
        discordId: string,
        totalMessage: number,
        totalVoice: number
    ) {
        this.recordId = recordId
        this.timestamp = timestamp
        this.discordId = discordId
        this.totalMessage = totalMessage
        this.totalVoice = totalVoice
    }

    static parseData(data: any) : PersonalRecordResponse {
        return new PersonalRecordResponse(
            data.recordId,
            data.timestamp,
            data.discordId,
            data.totalMessage,
            data.totalVoice
        )
    }
}