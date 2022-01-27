const config = require('./config')
const { Telegraf, Markup } = require('telegraf')
const superagent = require('superagent');

const bot = new Telegraf(config.bot.token)

bot.start((ctx) => ctx.reply('Драсте')) // add bot purpose
bot.help((ctx) => ctx.reply(`
• /menu - добаляет keyboard с командами
• check [url] - проверяет доступность сайта 
• add [url] - сохранят сайт
• list all - список всех сохранённых сайтов
• check all - проверяет все сохранённые сайты
• delete [url] - удаляет сайт из сохранённых
`))

bot.command('menu', async (ctx) => {
    return await ctx.reply('Меню', Markup
        .keyboard([
            [ 'check', 'add' ],
            [ 'check all', 'list all' ],
            [ 'delete' ]
        ])
        .resize()
    )
})

bot.hears('hi', async (ctx) => {
    const res = await getReqWithOnlyCookie('hi', getUserIdFromContext(ctx))
    ctx.reply(res.text)
})

bot.hears('list all', async (ctx) => {
    const res = await getReqWithOnlyCookie('listAll', getUserIdFromContext(ctx))
    ctx.reply(res.body.join('\n'))
})
bot.hears('check all', async (ctx) => {
    const res = await getReqWithOnlyCookie('checkAll', getUserIdFromContext(ctx))
    ctx.reply(res.body.map(element => `${ element.url } ${ element.status }`).join('\n'))
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
            const res = await getReq('checkUrl', url)
            return prettifyCheckHealthMessage(res.body)
        }
        case 'add': {
            await postReq('insert', url, userId)
            return `Ресурс ${ url } добавлен`
        }
        case 'delete': {
            await deleteReq('delete', url, userId)
            return `${ url } удалён`
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
            error: ${ checkMessage.error }
            `
    }
}

const postReq = async (command, url, userId) => {
    await superagent
        .post(`http://localhost:3000/${ command }`)
        .query(`url=${ url }`)
        .set('Cookie', `userId=${ userId }`)
}

const deleteReq = async (command, url, userId) => {
    await superagent
        .delete(`http://localhost:3000/${ command }`)
        .query(`url=${ url }`)
        .set('Cookie', `userId=${ userId }`)
}

const getReq = async (command, url, userId) => {
    const res = await superagent
        .get(`http://localhost:3000/${ command }`)
        .query(`url=${ url }`)
        .set('Cookie', `userId=${ userId }`)
    return res
}

const getReqWithOnlyCookie = async (command, userId) => {
    const res = await superagent
        .get(`http://localhost:3000/${ command }`)
        .set('Cookie', `userId=${ userId }`)
    return res
}

bot.launch()