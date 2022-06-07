export default class House {
    id: number
    headmaster: string
    name: string
    description: string
    primaryColor: string
    secondaryColor: string
    roleId: string
    dailyPoints: number
    weeklyPoints: number
    monthlyPoints: number
    annualPoints: number

    constructor (
        id: number,
        headmaster: string,
        name: string,
        description: string,
        primaryColor: string,
        secondaryColor: string,
        roleId: string,
        dailyPoints: number,
        weeklyPoints: number,
        monthlyPoints: number,
        annualPoints: number
    ) {
        this.id = id
        this.headmaster = headmaster
        this.name = name
        this.description = description
        this.primaryColor = primaryColor
        this.secondaryColor = secondaryColor
        this.roleId = roleId
        this.dailyPoints = dailyPoints
        this.weeklyPoints = weeklyPoints
        this.monthlyPoints = monthlyPoints
        this.annualPoints = annualPoints
    }

    static toDomainModel(data: any) : House {
        return new House(
            data.houseId,
            data.headmaster,
            data.name,
            data.description,
            data.primaryColor,
            data.secondaryColor,
            data.roleId,
            data.dailyPoints,
            data.weeklyPoints,
            data.monthlyPoints,
            data.annualPoints
        )
    }
}