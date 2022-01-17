const superagent = require('superagent');

const checkHealth = async (url) => {
    try {
        const response = await superagent.get(url);
        return {
            status: response.statusCode === 200 ? 'ok' : 'error',
            statusCode: response.statusCode
        }
    } catch (error) {
        switch (error.code) {
            case 'ENOTFOUND':
                return {
                    status: 'notFound',
                    statusCode: 404
                }
            default:
                return {
                    status: 'interError',
                    statusCode: 500,
                    error,
                }
        }
    }
}


module.exports.checkHealth = checkHealth