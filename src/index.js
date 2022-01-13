const express = require('express')

const app = express()
const port = 3000

app.get('/tg',(req, res) => {
    res.send('дратуйте')
})

app.listen(port, () => {
    console.log('слушаю я')
})