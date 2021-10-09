export default function processDatabaseRequest(request: Promise<any>, res: any) {
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