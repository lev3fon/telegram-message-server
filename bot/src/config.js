require('dotenv').config()

module.exports = {
    server: {
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_PORT
    },
    bot: {
        token: process.env.BOT_TOKEN
    }
}
