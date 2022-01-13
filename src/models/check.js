const superagent = require('superagent');

const checkHealth = async (url) => {
    try {
        const response = await superagent.get(url);
        return prettyfyCheckHealthMessage({
            status: response.statusCode === 200 ? 'ok' : 'error',
            statusCode: response.statusCode
        })
    } catch (error) {
        switch (error.code) {
            case 'ENOTFOUND':
                return prettyfyCheckHealthMessage({
                    status: 'notFound',
                    statusCode: 404
                })
            default:
                return prettyfyCheckHealthMessage({
                    status: 'interError',
                    statusCode: 500,
                    error,
                })
        }
    }
}

const prettyfyCheckHealthMessage = (checkMessage) =>{
    switch (checkMessage.statusCode) {
        case 200:
            return 'Запрашиваемый ресурс работает'
        case 404:
            return 'Запрашиваемый ресурс не найден'
        case 500:
            return `
            Произошла ошибка
            error: ${checkMessage.error}
            `
    }
}

module.exports.checkHealth = checkHealth