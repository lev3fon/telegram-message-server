const config = require('./config')
const { Telegraf, session, Scenes: { BaseScene, Stage }, Markup } = require('telegraf')
const superagent = require('superagent');

const serverReqHost = config.server.host
const serverReqPort = config.server.port

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
        .post(`${serverReqHost}:${serverReqPort}/${ command }`)
        .query(`url=${ url }`)
        .set('Cookie', `userId=${ userId }`)
}

const deleteReq = async (command, url, userId) => {
    await superagent
        .delete(`${serverReqHost}:${serverReqPort}/${ command }`)
        .query(`url=${ url }`)
        .set('Cookie', `userId=${ userId }`)
}

const getReq = async (command, url, userId) => {
    const res = await superagent
        .get(`${serverReqHost}:${serverReqPort}/${ command }`)
        .query(`url=${ url }`)
        .set('Cookie', `userId=${ userId }`)
    return res
}

const getReqWithOnlyCookie = async (command, userId) => {
    const res = await superagent
        .get(`${serverReqHost}:${serverReqPort}/${ command }`)
        .set('Cookie', `userId=${ userId }`)
    return res
}

const checkUrlScene = new BaseScene('checkUrl')
checkUrlScene.enter((ctx => {
    ctx.reply(`
    Отправьте url ресурса, для проеврки его работоспособности
    
    /cancel - отменить действие
    `)
}))
checkUrlScene.command('cancel', (ctx) => {
    ctx.scene.leave()
    ctx.reply('Действие отменено')
})
checkUrlScene.on('message', async (ctx) => {
    const url = ctx.update.message.text
    const res = await getReq('checkUrl', url)
    ctx.reply(prettifyCheckHealthMessage(res.body))
    ctx.scene.leave()
})

const addUrlScene = new BaseScene('addUrl')
addUrlScene.enter((ctx => {
    ctx.reply(`
    Отправьте url ресурса, который хотите сохранить
    
    /cancel - отменить действие
    `)
}))
addUrlScene.command('cancel', (ctx) => {
    ctx.scene.leave()
    ctx.reply('Действие отменено')
})
addUrlScene.on('message', async (ctx) => {
    const url = ctx.update.message.text
    await postReq('insert', url, getUserIdFromContext(ctx))
    ctx.reply(`Ресурс ${url} добавлен`)
    ctx.scene.leave()
})

const deleteUrlScene = new BaseScene('deleteUrl')
deleteUrlScene.enter((ctx => {
    ctx.reply(`
    Отправьте url ресурса, который хотите сохранить
    
    /cancel - отменить действие
    `)
}))
deleteUrlScene.command('cancel', (ctx) => {
    ctx.scene.leave()
    ctx.reply('Действие отменено')
})
deleteUrlScene.on('message', async (ctx) => {
    const url = ctx.update.message.text
    await deleteReq('delete', url, getUserIdFromContext(ctx))
    ctx.reply(`Ресурс ${url} удалён`)
    ctx.scene.leave()
})

const stage = new Stage([checkUrlScene, addUrlScene, deleteUrlScene])
const bot = new Telegraf(config.bot.token)

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => ctx.reply('Драсте')) // add bot purpose
bot.help((ctx) => ctx.reply(`
• /menu - добаляет keyboard с командами
• check [url] - проверяет доступность сайта 
• add [url] - сохранят сайт
• list all - список всех сохранённых сайтов
• check all - проверяет все сохранённые сайты
• delete [url] - удаляет сайт из сохранённых
`))

bot.hears('check', (ctx) => {
    ctx.scene.enter('checkUrl')
})
bot.hears('add', (ctx) => {
    ctx.scene.enter('addUrl')
})
bot.hears('delete', (ctx) => {
    ctx.scene.enter('deleteUrl')
})

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

bot.launch()
