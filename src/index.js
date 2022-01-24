const express = require('express')
const cookieParser = require('cookie-parser');

const {checkUrl, listUrls, checkUrls, insertUrl, deleteUrl} = require('./models/url')
const {handleReqWithUrl, handleReqWithUserId, handleReqWithUserIdAndUrl} = require('./models/req-handler')

const app = express()
app.use(cookieParser())
const host = 'localhost'
const port = 3000

app.get('/hi', (req, res) => {
    res.send('дратуйте')
})

app.get('/cookie', (req, res) => {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed - пока хз что это
    console.log('Signed Cookies: ', req.signedCookies)
    res.send('нормана')
})

// host/checkUrl?url=[url]
app.get('/checkUrl', async (req, res) => {
    res.send(await handleReqWithUrl(checkUrl, req))
})

app.post('/insert', async (req, res) => {
    res.send(await handleReqWithUserIdAndUrl(insertUrl, req))
})

app.delete('/delete', async (req, res) => {
    res.send(await handleReqWithUserIdAndUrl(deleteUrl, req))
})

app.get('/checkAll', async (req, res) => {
    res.send(await handleReqWithUserId(checkUrls, req))
})

app.get('/listAll', async (req, res) => {
    res.send(await handleReqWithUserId(listUrls, req))
})

app.listen(port, host, () => {
    console.log('слушаю я')
})
