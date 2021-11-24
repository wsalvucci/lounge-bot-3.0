class Quote {
    current: number
    change: number
    percentChange: number
    high: number
    low: number
    open: number
    previousClose: number

    constructor(
        current: number,
        change: number,
        percentChange: number,
        high: number,
        low: number,
        open: number,
        previousClose: number
    ) {
        this.current = current
        this.change = change
        this.percentChange = percentChange
        this.high = high
        this.low = low
        this.open = open
        this.previousClose = previousClose
    }

    static toDomainModel(data: any) : Quote {
        return new Quote(
            data.c,
            data.d,
            data.dp,
            data.h,
            data.l,
            data.o,
            data.pc
        )
    }
}

export default Quote