const express = require('express')
const app = express()

const PORT = 8080

app.use('/assets', express.static('assets'))

app.use('*', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`)
})