import { getLeaderboard, getTitle, getUser, updateUserValue } from "../domain/databaseRequests";
import app from "../domain/expressModule";

function processDatabaseRequest(request: Promise<any>, res: any) {
    request.then((data: any) => {
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
}

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

app.get(`/leaderboard/:stat`, (req: any, res: any) => {
    processDatabaseRequest(getLeaderboard(req.params.stat, req.query.order), res)
})

app.get(`/title/:titleId`, (req: any, res: any) => {
    getTitle(req.params.titleId).then((data: any) => {
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

app.get(`/updateUser`, (req: any, res: any) => {
    updateUserValue(req.query.discordId, 'nickname', req.query.nickname).then((data: any) => {
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