// Node modules 
const discord = require('discord.js')

// personal modules
const config = require('./config.json')
const bot = require('./bot.js')

// Create a new instance of the discord client to allow our bot to function
const client = new discord.Client()

client.on('ready', () => {
    bot.actions.greetGuild(client)
})

// Log the bot into the server using it's personal token
client.login(config.token)