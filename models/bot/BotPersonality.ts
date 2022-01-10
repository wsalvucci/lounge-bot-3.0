class BotPersonality {
    id: number
    name: string
    description: string
    aggression: number
    corruption: number
    chaos: number
    slapFavor: number
    gulagFavor: number

    constructor(
        id: number,
        name: string,
        description: string,
        aggression: number,
        corruption: number,
        chaos: number,
        slapFavor: number,
        gulagFavor: number
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.aggression = aggression
        this.corruption = corruption
        this.chaos = chaos
        this.slapFavor = slapFavor
        this.gulagFavor = gulagFavor
    }

    static toDomainModel(data: any) : BotPersonality {
        return new BotPersonality(
            data.personalityId,
            data.personalityName,
            data.personalityDescription,
            data.aggression,
            data.corruption,
            data.chaos,
            data.slapFavor,
            data.gulagFavor
        )
    }
}

export default BotPersonality