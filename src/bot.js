const {Telegraf} = require('telegraf')
const {checkHealth} = require('./models/check')
const {Urls} = require('./db-models/index')

const bot = new Telegraf('5016091202:AAGRRRz9PvT6a2386TNZgVYeb8OMWNnvaBs')

bot.start((ctx) => ctx.reply('Драсте'))
bot.hears('lol', (ctx) => ctx.reply('kek'))

bot.on('message', async (ctx) => {
    const ans = await messageParser(ctx.update.message.text, ctx.update.message.from.id)
    console.log(ans)
    ctx.reply(ans)
})


const messageParser = async (message, userId = undefined) => {
    console.log(message)
    const parts = message.split(' ')
    console.log(parts)

    switch (parts[0]) {
        case 'check':
            return await checkHealth(parts[1])
        case 'add': {
            await Urls.create({userId: userId, url: parts[1]})
            return `Ресурс ${parts[1]} добавлен`
        }
        default:
            return 'unknown command'
    }
}

const addSite = (url) => {

}

bot.launch()
