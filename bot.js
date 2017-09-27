const discord = require('discord.js')
const config = require('./config.json')
const tmas = require('./tma.json')
const client = new discord.Client()

// When the bot is ready for use
client.on('ready', () => {
    console.log("OU-HELPER-BOT LOADED") 
})

// When the bot recieves a message
client.on('message', message => {

    // Capture the sender of the message
    let sender = message.author

    // Determine if the message should be interpreted as a command (all commands start with !)
    let isCommand = message.content.startsWith(config.prefix)

    // If the sender of the message is a bot, ignore it
    if (sender.bot) return

    // Log that a message was recieved and who the message was sent from
    console.log(`Message recieved from ${sender.username}`)

    // If the message will be treated as a command
    if (isCommand) {

        // To avoid any issues with caps / no caps, all commands will be converted to upper case to avoid this
        let command = message.content.toUpperCase()

        // Determine which command the user is requesting, if it doesnt match any, inform the user of this

        /*
        IMPORTANT:
        Most (if not all) command responses will be sent through PM to avoid the text chat of a channel being cluttered with bot messages! 
        */
        switch (command) {

            // Simple command to greet the user
            case '!HI':
                sender.send(`Hi there ${sender.username} how are you!?`)
                break
            
            // This command will inform the user of the current username of this bot (feels weird typing in the third person)
            case '!INFO':
                let creator = client.users.get(config.authorID)
                sender.send(`I am a discord bot created by ${creator.username} using the discord.js module!`)
                break
            
            // This command will grab a list of people with Admin privelages and inform the user of their usernames
            /*
            TODO:
            1) Rewrite code so it can be used for multiple guilds (possibly) / to find diferent roles
            2) Filter the array to only include mods that are online / available
            3) Code seems kinda janky, look into cleaner ways to do this 
            */
            case '!MODS':
                // String to hold the list of results
                let result = "List of Mods: "

                // Reason this line is long is because when this command was used through PM it crashed the app!
                // So instead of searching through the sender we search relative to the bot's guild!
                let admins = client.guilds.find("name", "Test").roles.find("name", "Admin").members
                
                // Iterate over the found results and add them to the result string (seperating them with ', ')
                admins.forEach(admin => result += admin.user.username + ", ")

                // The reason for this is because the last result being added in the loop will add an extra ', ' to the string
                // We just remove this ¯\_(ツ)_/¯
                result = result.substr(0, result.length -2)
                
                sender.send(result)
                break
            
            // This command will give the user a link to the projects github!
            case '!SOURCE':
                sender.send(`I am open source! Github: https://github.com/LiamSutton/discord-bot`)
                break

            // This command will give the user a list of all the tma's for the module with their cutt-off date
            case '!TMAS':
                let results = ""
                tmas.assignments.forEach(assignment => results += `Name: ${assignment.name}\nCut-off date: ${assignment.end} \n\n`)
                sender.send(results)
                break

            // This command will give the user a list of all the commands the bot can use
            case '!HELP':
                sender.send("Commands: !hi, !mods, !source, !info, !tmas and of course you allready know about the !help command")
                break
            // If the command isn't recognised, let the user know
            default:
            sender.send(`Hmm.. I didnt quite get that, to show all my commands type '!help'`)
        }
    }
})

// When a new person joins the guild, the bot will introduce itself!
client.on('guildMemberAdd', member => {
    member.send("Hi there I'm the ou-helper-bot, to get my commands list just type !help")
})

client.login(config.token)