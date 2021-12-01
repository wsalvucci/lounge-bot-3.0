import query from '../../domain/database'

export function buyStock(discordId: string, stockSymbol: string, quantity: number, costPerShare: number, timestamp: number) {
    query(`INSERT INTO user_stocks (userId, stockSymbol, quantity, costPerShare) VALUES (${discordId}, '${stockSymbol}', ${quantity}, ${costPerShare}) ON DUPLICATE KEY UPDATE quantity = quantity + ${quantity}, costPerShare = ((quantity * costPerShare) + (${quantity} * ${costPerShare})) / (quantity + ${quantity})`)
    return query(`INSERT INTO user_stock_purchases (userId, stockSymbol, quantity, costPerShare, timestamp) VALUES (${discordId}, '${stockSymbol}', ${quantity}, ${costPerShare}, ${timestamp})`)
}

export function sellStock(discordId: string, stockSymbol: string, quantity: number) {
    return query(`UPDATE user_stocks SET quantity = quantity - ${quantity} WHERE userId = ${discordId} and stockSymbol = '${stockSymbol}'`)
}

export function getStocks(discordId: string) {
    return query(`SELECT stockSymbol, quantity, costPerShare FROM user_stocks WHERE userId = ${discordId}`)
}