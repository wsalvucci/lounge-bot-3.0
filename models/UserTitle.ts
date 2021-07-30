class UserTitle {
    id: number
    name: string
    color: string
    condition: string

    constructor(
        id: number,
        name: string,
        color: string,
        condition: string,
    ) {
        this.id = id
        this.name = name
        this.color = color
        this.condition = condition
    }

    static toDomainModel(data: any) : UserTitle {
        return new UserTitle(
            data.titleId,
            data.titleName,
            data.titleColor,
            data.titleCondition
        )
    }
}

export default UserTitle