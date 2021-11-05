import { createUser, getLeaderboard, getPersonalRecord, getTitle, getUser, incrementUserValue, updateUserValue } from "../domain/databaseRequests";
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
        res.send(error)
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

/**
 * Wat. Seems like an outdated usage?
 */
app.get(`/updateUser`, (req: any, res: any) => {
    updateUserValue(req.query.discordId, req.query.propertyName, req.query.value).then((data: any) => {
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

app.get(`/incrementUserStat`, (req: any, res: any) => {
    processDatabaseRequest(incrementUserValue(req.query.discordId, req.query.statName, req.query.amount), res)
})

app.get(`/updateUserProperty`, (req: any, res: any) => {
    updateUserValue(req.query.discordId, req.query.propertyName, req.query.value)
        .then((data: any) => {
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

app.get(`/createUser`, (req: any, res: any) => {
    processDatabaseRequest(createUser(req.query.discordId, req.query.name, req.query.timeAdded), res)
})

app.get(`/personalRecords`, (req: any, res: any) => {
    processDatabaseRequest(getPersonalRecord(req.query.discordId), res)
})