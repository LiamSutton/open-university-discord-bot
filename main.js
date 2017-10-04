// Node modules 
const discord = require('discord.js')

// personal modules
const config = require('./config.json')
const bot = require('./bot.js')

// Create a new instance of the discord client to allow our bot to function
const client = new discord.Client()

// When the bot is ready to be used greet the guild to inform them
client.on('ready', () => {
    bot.actions.greetGuild(client)
})

// Whenever a message is sent in the guild
client.on('message', (message) => {
    
    // Capture the sender of the message
    let sender = message.author

    // If the sender of the message is a bot ignore the message
    if (sender.bot) return

    // Determine if the message should be treated as a command (all commands will start with '!')
    let isCommand = message.content.startsWith(config.commandPrefix)

    // If the message should be treated as a command
    if (isCommand) {
        
        // Capture the command by putting the message into an array and seperating it whenever there is a space, grab the zeroth index (the command)
        let command = message.content.split(' ')[0]
        
        /* 
        IMPORTANT
        Most (if not all commands) responses will be sent via PM in an effort to reduce clutter inside of the channels from bots!
        */

        // Run the text through all known commands and try to match it to a case
        switch (command) {

            // This will return a message greeting the user
            case '!hi':
            bot.actions.commands.hi(sender)
            break

            // This will return a message giving the user a link to the projects github page
            case '!source':
            bot.actions.commands.source(sender)
            break

            // This will return a message stating the authors current user name and also the main module used in creating the bot
            case '!info':
            bot.actions.commands.info(sender, client.users.get(config.authorID))
            break

            // This will return a message listing all of the TMA's for this module alongside their cut-off date
            case '!tmas':
            bot.actions.commands.tmas(sender)
            break

            // This will allow the user to add a defenition to a list of known definitions by formatting the message as so:
            // '!define word a sentance giving a brief definition of the word'
            case '!define':
            bot.actions.commands.define(message.content, sender)
            break

            // This will allow the user to search through a list of known definitions and retrieve a single definition by formatting the message as so:
            // '!definition word'
            case '!definition':
            bot.actions.commands.defenition(message.content, sender)
            break

            // This will return a message listing all known words alongside their definitions
            case '!alldefinitions':
            bot.actions.commands.alldefinitions(sender)
            break

            // This will return a message containing a list of all admins on the server as well as a list of all currently online admins
            case '!admins':
            bot.actions.commands.admins(client, sender)
            break

            // This will return a message containing a list of all the commands the bot currently knows
            case '!help':
            bot.actions.commands.help(sender)
            break

            // If the command is not recognised by the bot, it will inform the user of this and encourage them to use the '!help' command
            default:
            bot.actions.commands.unknown(sender)
        }
    }
})

// Log the bot into the server using it's personal token
client.login(config.token)