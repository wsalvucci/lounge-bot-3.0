export default class House {
    id: number
    headmaster: string
    name: string
    description: string
    primaryColor: string
    secondaryColor: string
    roleId: string

    constructor (
        id: number,
        headmaster: string,
        name: string,
        description: string,
        primaryColor: string,
        secondaryColor: string,
        roleId: string
    ) {
        this.id = id
        this.headmaster = headmaster
        this.name = name
        this.description = description
        this.primaryColor = primaryColor
        this.secondaryColor = secondaryColor
        this.roleId = roleId
    }

    static toDomainModel(data: any) : House {
        return new House(
            data.houseId,
            data.headmaster,
            data.name,
            data.description,
            data.primaryColor,
            data.secondaryColor,
            data.roleId
        )
    }
}