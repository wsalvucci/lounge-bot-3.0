class UserStock {
    purchaseId: number
    discordId: string
    stockSymbol: string
    quantity: number
    costPerShare: number
    timestamp: number

    constructor(
        purchaseId: number,
        discordId: string,
        stockSymbol: string,
        quantity: number,
        costPerShare: number,
        timestamp: number
    ) {
        this.purchaseId = purchaseId
        this.discordId = discordId
        this.stockSymbol = stockSymbol
        this.quantity = quantity
        this.costPerShare = costPerShare
        this.timestamp = timestamp
    }

    static toDomainModel(data: any) : UserStock {
        return new UserStock(
            data.purchaseId,
            data.discordId,
            data.stockSymbol,
            data.quantity,
            data.costPerShare,
            data.timestamp
        )
    }
}

export default UserStock