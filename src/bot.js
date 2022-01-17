const config = require('./config')
const { Telegraf } = require('telegraf')
const { checkUrl, listUrls, checkUrls, insertUrl, deleteUrl } = require('./models/url')

const bot = new Telegraf(config.bot.token)

bot.start((ctx) => ctx.reply('Драсте')) // add bot purpose
bot.help((ctx) => ctx.reply(`
• check [url] - проверяет доступность сайта 
• add [url] - сохранят сайт
• list all - список всех сохранённых сайтов
• check all - проверяет все сохранённые сайты
• delete [url] - удаляет сайт из сохранённых
`))

bot.hears('list all', async (ctx) => {
    const ans = await listUrls(getUserIdFromContext(ctx))
    ctx.reply(ans.join('\n'))
})
bot.hears('check all', async (ctx) => {
    const ans = await checkUrls(getUserIdFromContext(ctx))
    ctx.reply(ans.map(element => `${element.url} ${element.status}`).join('\n'))
})

bot.on('message', async (ctx) => {
    const ans = await messageParser(ctx.update.message.text, getUserIdFromContext(ctx))
    ctx.reply(ans)
})

const getUserIdFromContext = (ctx) => {
    try {
        return ctx.update.message.from.id
    } catch (e) {
        console.log('wrong ctx format', ctx)
    }
}

const messageParser = async (message, userId) => {
    const parts = message.split(' ')
    const url = parts[1]
    switch (parts[0]) {
        case 'check': {
            return prettifyCheckHealthMessage(await checkUrl(parts[1]))
        }
        case 'add': {
            await insertUrl(userId, url)
            return `Ресурс ${parts[1]} добавлен`
        }
        case 'delete': {
            await deleteUrl(userId, url)
            return `${url} удалён`
        }
        default:
            return 'unknown command'
    }
}

const prettifyCheckHealthMessage = (checkMessage) => { // add 'default' to switch case
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