export default class ShopRole {
    roleId: string | null
    name: string
    costPerDay: number

    constructor(
        roleId: string | null,
        name: string,
        costPerDay: number
    ) {
        this.roleId = roleId
        this.name = name
        this.costPerDay = costPerDay
    }

    static toDomainModel(data: any) : ShopRole {
        if (data == undefined) {
            return new ShopRole(
                null,
                "",
                0
            )
        } else {
            return new ShopRole(data.roleId, data.name, data.costPerDay)
        }
    }
}