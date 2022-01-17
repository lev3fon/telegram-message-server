const config = require('./config')

module.exports = {
    "development": config.postgres,
    "test": config.postgres,
    "production": config.postgres
}