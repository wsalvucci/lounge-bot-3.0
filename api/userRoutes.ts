import { addMessage, addPersonalRecord, addServerRecord, addVoice, createUser, getAllUsers, getLeaderboard, getPersonalRecord, getTitle, getUser, incrementUserValue, updateUserValue } from "../domain/databaseRequests";
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

app.get(`/user/getUser`, (req: any, res: any) => {
    getUser(req.query.discordId).then((data: any) => {
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

app.get(`/user/getAllUsers`, (req: any, res: any) => {
    processDatabaseRequest(getAllUsers(), res)
})

app.get(`/user/addVoice`, (req: any, res: any) => {
    processDatabaseRequest(addVoice(req.query.discordId, req.query.amount, req.query.xp), res)
})

app.get(`/user/addMessage`, (req: any, res: any) => {
    processDatabaseRequest(addMessage(req.query.discordId, req.query.xp), res)
})

app.get(`/user/addPersonalRecord`, (req: any, res: any) => {
    processDatabaseRequest(addPersonalRecord(req.query.discordId, req.query.timestamp, req.query.messages, req.query.voice), res)
})

app.get(`/user/addServerRecord`, (req: any, res: any) => {
    processDatabaseRequest(addServerRecord(req.query.timestamp, req.query.messages, req.query.voice), res)
})