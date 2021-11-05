class BotPersonality {
    id: number
    name: string
    description: string

    constructor(
        id: number,
        name: string,
        description: string
    ) {
        this.id = id
        this.name = name
        this.description = description
    }

    static toDomainModel(data: any) : BotPersonality {
        return new BotPersonality(
            data.personalityId,
            data.personalityName,
            data.personalityDescription
        )
    }
}

export default BotPersonality