import SqlResponse from "../responseModels/SqlResponse"
import LoungeUser from "../responseModels/LoungeUser"

const fetch = require("node-fetch")
const endpoint = process.env.API_ENDPOINT

function apiCall(path: string) {
    return new Promise(function(resolve, reject) {
        fetch(`${endpoint}${path}`)
    })
}

class Repository {
    async getUser (discordId: string) : Promise<LoungeUser | SqlResponse> {
        try {
            const data = await apiCall(`user/${discordId}`)
            return LoungeUser.dataToModel(data)
        } catch (error) {
            return SqlResponse.dataToModel(error)
        }
    }
}

export default new Repository