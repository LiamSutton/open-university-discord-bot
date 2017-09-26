const discord = require('discord.js')
const token = require('./secret.js')

const client = new discord.Client()

client.on('ready', () => {
    console.log("OU-HELPER-BOT LOADED")
})

client.on('message', message => {
    let sender = message.author

    if (sender.bot) return

    console.log("[INFO]: Message recieved from: " + sender.username + " at: " + message.createdAt.getHours() + ":" + message.createdAt.getMinutes())
})

client.login(token)