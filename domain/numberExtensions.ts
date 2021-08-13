declare global {
    interface Number {
        withCommas: () => string
    }
}

Number.prototype.withCommas = function() : string {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export {}