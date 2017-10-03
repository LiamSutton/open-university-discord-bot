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

client.on('message', (message) => {
    
    let sender = message.author

    // If the sender of the message is a bot ignore the message
    if (sender.bot) return

    // Determine if the message should be treated as a command (all commands will start with '!')
    let isCommand = message.content.startsWith(config.commandPrefix)

    // If the message should be treated as a command
    if (isCommand) {
        
        // Capture the command
        let command = message.content.split(' ')[0]
        
        switch (command) {

            case '!hi':
            bot.actions.commands.hi(sender)
            break

            case '!source':
            bot.actions.commands.source(sender)
            break

            case '!info':
            bot.actions.commands.info(sender, client.users.get(config.authorID))
            break

            case '!tmas':
            bot.actions.commands.tmas(sender)
            break

            case '!define':
            bot.actions.commands.define(message.content, sender)
            break

            case '!definition':
            bot.actions.commands.defenition(message.content, sender)
            break

            case '!alldefinitions':
            bot.actions.commands.alldefinitions(sender)
            break

            case '!admins':
            bot.actions.commands.admins(client, sender)
            break

            default:
            bot.actions.commands.unknown(sender)
        }
    }
})

// Log the bot into the server using it's personal token
client.login(config.token)