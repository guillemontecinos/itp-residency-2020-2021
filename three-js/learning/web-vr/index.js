const express = require('express')
const fs = require('fs')
const https = require('https')
const path = require('path')
const app = express()

app.use(express.static('public'))

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}, app)
.listen(3000, function () {
    console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})