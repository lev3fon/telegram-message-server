const superagent = require('superagent');
const {Urls} = require("../db-models");

const checkUrl = async (url) => {
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

const checkUrls = async (userId) => {
    const urls = await listUrls(userId)

    const urlPromises = urls.map(async (url) => {
        const statusMessage = await checkUrl(url)
        return {
            url,
            status: statusMessage.status
        }
    })

    return await Promise.all(urlPromises)
}

const listUrls = async (userId) => {
    const urls = await Urls.findAll({
        where: {userId},
        raw: true,
    })

    return urls.map(elem => elem.url).sort()
}

const insertUrl = async (userId, url) => {
    await Urls.create({userId, url})
}

const deleteUrl = async (userId, url) => {
    await Urls.destroy({
        where: {
            userId,
            url
        }
    })

}

module.exports = {
    checkUrl,
    checkUrls,
    listUrls,
    insertUrl,
    deleteUrl,
}