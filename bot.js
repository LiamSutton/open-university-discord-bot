const discord = require('discord.js')
const token = require('./secret.js')

const client = new discord.Client()

client.on('ready', () => {
    console.log("OU-HELPER-BOT LOADED")
})


client.login(token)