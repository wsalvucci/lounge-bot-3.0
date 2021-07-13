import { getUser } from "domain/databaseRequests";
import app from "domain/expressModule";

app.get(`/user/:discordId`, (req: any, res: any) => {
    getUser(req.params.discordId).then((data: any) => {
        if (data.err) {
            console.error(data.err)
            res.end()
        } else {
            res.send(data)
            res.end()
        }
    }).catch((error: any) => {
        console.error(error)
        res.end()
    })
})