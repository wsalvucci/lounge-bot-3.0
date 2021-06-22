const express = require('express')
const app = express()

app.listen(process.env.API_PORT, () => {
    console.log('API is listening on port ' + process.env.API_PORT)
})

export default app