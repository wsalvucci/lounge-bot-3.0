const fetch = require("node-fetch")
const endpoint = process.env.API_ENDPOINT

export default function apiCall(path: string) {
    return new Promise(function(resolve, reject) {
        fetch(`${endpoint}${path}`)
            .then((res: { json : () => any}) => res.json())
            .then((json: string) => {resolve(json)})
            .catch((err: any) => reject(err))
    })
}