require('dotenv').config()

module.exports = {
    postgres: {
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_NAME,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: process.env.POSTGRES_DIALECT,
    }
}
