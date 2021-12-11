class PersonalityFavor {
    personalityId: number
    userId: string
    favor: number

    constructor(
        personalityId: number,
        userId: string,
        favor: number
    ) {
        this.personalityId = personalityId
        this.userId = userId
        this.favor = favor
    }

    static toDomainModel(data: any) : PersonalityFavor {
        return new PersonalityFavor(
            data.personalityId,
            data.userId,
            data.favor
        )
    }
}

export default PersonalityFavor