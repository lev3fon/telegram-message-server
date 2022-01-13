const { Telegraf } = require('telegraf')
const { checkHealth } = require('./models/check')

const bot = new Telegraf('5016091202:AAGRRRz9PvT6a2386TNZgVYeb8OMWNnvaBs')

bot.start((ctx) => ctx.reply('Драсте'))
bot.hears('lol', (ctx) => ctx.reply('kek'))
bot.hears('check')
bot.on('message', async (ctx) => {
    const ans = await messageParser(ctx.update.message.text)
    ctx.reply(ans)
})


const messageParser = async (message) =>{
    console.log(message)
    const parts = message.split(' ')
    console.log(parts)

    if(parts[0] === 'check') {
        return await checkHealth(parts[1])
    } else {
        return 'unknown command'
    }
}

bot.launch()
