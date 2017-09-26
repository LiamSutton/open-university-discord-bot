const discord = require('discord.js')
const token = require('./secret.js')

const commandPrefix = '!'

const client = new discord.Client()

client.on('ready', () => {
    console.log("OU-HELPER-BOT LOADED")
})


client.on('message', message => {
    let sender = message.author
    let isCommand = message.content.startsWith(commandPrefix)

    if (sender.bot) return

    console.log(`[INFO] Message recieved from ${sender.username}`)

    if (isCommand) {
        let command = message.content.toUpperCase()

        switch (command) {
            case '!HI':
                sender.send(`Hi there ${sender.username}, how are you!?`)
                break
            
            case '!INFO':
                sender.send(`I am a discord bot built by Sugoi Memes using the Discord.js module! :smiley:`)
                break
            
            case '!SOURCE':
                sender.send(`I am open source! Github: https://github.com/LiamSutton/discord-bot`)
                break

            default:
            sender.send(`Hmm.. I didnt quite get that, to show all my commands type '!help'`)
        }
    }
})

client.login(token)