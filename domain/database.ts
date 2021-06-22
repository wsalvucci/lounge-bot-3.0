import mysql2 from 'mysql2'

const connection = mysql2.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB
})

export default function(query: string): Promise<any> {
    return new Promise(function(resolve, reject) {
        connection.query(query, function(err: any, res: any) {
            if (err) reject(err)
            resolve(res)
        })
    })
}