const {Telegraf} = require('telegraf')
const {checkHealth} = require('./models/check')
const {Urls} = require('./db-models/index')

const bot = new Telegraf('5016091202:AAGRRRz9PvT6a2386TNZgVYeb8OMWNnvaBs')

bot.start((ctx) => ctx.reply('Драсте'))
bot.hears('lol', (ctx) => ctx.reply('kek'))
bot.hears('list sites', async (ctx) => {
    const ans = await getListSites(ctx.update.message.from.id)
    ctx.reply(ans)
})
bot.hears('check all', async (ctx) => {
    const ans = await checkAll(ctx.update.message.from.id)
    ctx.reply(ans)
})

bot.on('message', async (ctx) => {
    const ans = await messageParser(ctx.update.message.text, ctx.update.message.from.id)
    console.log(ans)
    ctx.reply(ans)
})

const messageParser = async (message, userId = undefined) => {
    const parts = message.split(' ')

    switch (parts[0]) {
        case 'check': {
            return prettyfyCheckHealthMessage(await checkHealth(parts[1]))
        }
        case 'add': {
            await Urls.create({userId: userId, url: parts[1]})
            return `Ресурс ${parts[1]} добавлен`
        }
        case 'delete': {
            try {
                await Urls.destroy({
                    where: {
                        userId: userId,
                        url: parts[1]
                    }
                })
                return `${parts[1]} удалён`
            } catch (error){
                return 'Произошла ошибка во время удаления, возможно такой сайт уже удалён'
            }
        }
        default:
            return 'unknown command'
    }
}

const checkAll = async (userId) => {
    const urls = await Urls.findAll({
        where: {
            userId: userId
        }
    })

    const res = []
    for (let urlModel of urls) {
        const statusMessage = await checkHealth(urlModel.url)
        res.push(`${urlModel.url} ${statusMessage.status}`)
    }

    res.sort()

    return res.join('\n')
}

const getListSites = async (userId) => {
    const urls = await Urls.findAll({
        where: {
            userId: userId
        }
    })

    const res = []
    for (let urlModel of urls) {
        res.push(urlModel.url)
    }

    res.sort()

    return res.join('\n')
}

const prettyfyCheckHealthMessage = (checkMessage) => {
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

bot.launch()
