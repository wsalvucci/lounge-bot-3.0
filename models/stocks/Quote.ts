class Quote {
    symbol: string
    sector: string
    securityType: string
    bidPrice: number
    bidSize: number
    askPrice: number
    askSize: number
    lastUpdated: number
    lastSalePrice: number
    lastSaleSize: number
    lastSaleTime: number
    volume: number

    constructor(
        symbol: string,
        sector: string,
        securityType: string,
        bidPrice: number,
        bidSize: number,
        askPrice: number,
        askSize: number,
        lastUpdated: number,
        lastSalePrice: number,
        lastSaleSize: number,
        lastSaleTime: number,
        volume: number
    ) {
        this.symbol = symbol
        this.sector = sector
        this.securityType = securityType
        this.bidPrice = bidPrice
        this.bidSize = bidSize
        this.askPrice = askPrice
        this.askSize = askSize
        this.lastUpdated = lastUpdated
        this.lastSalePrice = lastSalePrice
        this.lastSaleSize = lastSaleSize
        this.lastSaleTime = lastSaleTime
        this.volume = volume
    }

    static toDomainModel(data: any) : Quote {
        return new Quote(
            data.symbol,
            data.sector,
            data.securityType,
            data.bidPrice,
            data.bidSize,
            data.askPrice,
            data.askSize,
            data.lastUpdated,
            data.lastSalePrice,
            data.lastSaleSize,
            data.lastSaleTime,
            data.volume
        )
    }
}

export default Quote