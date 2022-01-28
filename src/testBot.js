/* eslint-disable @typescript-eslint/no-floating-promises */
const config = require('./config')
const { Telegraf, session, Scenes: { BaseScene, Stage } } = require('telegraf')


const nameScene = new BaseScene('nameScene')
nameScene.enter((ctx) => {
    ctx.reply('Какое имя?')

})
nameScene.on('text', (ctx) => {
    ctx.session.name = ctx.message.text

    return ctx.scene.leave()
})
nameScene.leave((ctx) => {
    ctx.reply('Имя установили')
})

const stage = new Stage([ nameScene ])

const bot = new Telegraf(config.bot.token)

bot.use(session())
bot.use(stage.middleware())
bot.command('name', (ctx) => {
    ctx.scene.enter('nameScene')
})
bot.command('lol', (ctx) => ctx.reply('kek'))
bot.launch()
