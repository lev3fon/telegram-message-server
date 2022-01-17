const express = require('express')

const app = express()
const port = 3000

app.get('/tg',(req, res) => {
    res.send('дратуйте')
})

app.listen(port, () => {
    console.log('слушаю я')
})


//docker run --name tg-bot -p 6432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=post123 -e POSTGRES_DB=bot-db -d postgres
//npx sequelize-cli model:generate --name Urls --attributes userId:int,url:text