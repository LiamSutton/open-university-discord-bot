

const discord = require('discord.js')
const fs = require('fs')
const config = require('./config.json')
const tmas = require('./tma.json')
const client = new discord.Client()

// When the bot is ready for use
client.on('ready', () => {
    console.log("OU-HELPER-BOT LOADED")
    
    // Inform the Guild that the bot is now online
    client.guilds.find("name", "Test").channels.find("name", "general").send("Hello World!")
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
        let command = message.content.toUpperCase().split(' ')[0]

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

            // A command to list all of the definitions for words that people may have dificulty with
            case '!ALLDEFINITIONS':

                // Read the file containing all of the current definitions
                fs.readFile('./definitions.json', 'utf-8', (err, data) => {

                    // if there is an issue with this throw the error
                    if (err) throw err

                    // Parse the information held inside the file
                    let information = JSON.parse(data)

                    // Create an empty string to hold the definitions
                    let result = ''

                    // For every definition, append the word to the results string formatted as so (word : definition)
                    information.definitions.forEach(definition => result += `${definition.word} : ${definition.definition} \n \n`)

                    // After all the definitions have been gathered send them to the user
                    sender.send(result)
                })
                break
            
            // This command will allow the user to search for a specific definition
            case '!DEFINITION':
                
                // To get the word the user is searching for we split the message into an array and grab the 2nd item (1's index)
                let searchTerm = message.content.split(' ')[1]
                
                // We load the json file that contains all of the current definitions
                fs.readFile('./definitions.json', 'utf-8', (err, data) => {

                    // If there's an error throw it
                    if (err) throw err

                    // Parse the information held in the file
                    let information = JSON.parse(data)

                    // To find the definition the user is after we filter the list to only contain definitions which word matches the search term
                    // and grab the first one
                    let find = information.definitions.filter(definition => definition.word == searchTerm)[0]
                    
                    // We know that if the definition has been found the find variable will not be undefined
                    let found = find != undefined

                    // if the definition was found, send it to the user, otherwise inform them of this and prompt them to add to the list if they find it out!
                    if (found) {
                        sender.send(`${find.word} : ${find.definition}`)
                    } else {
                        sender.send("Hmmm, I dont seem to have a definition for that word,\nif you figure it out add it to the ones I know using the !DEFINE command :smiley:")
                    }
                })
                break

            case '!DEFINE':
                //TODO: Tidy up and refactor possibly to ensure no duplicates can be added

                // To get both the word to define and the defenition we split the recieved message into an array
                // we then filter the array to only include words that aren't the command (!DEFINE)
                let fullMessage = message.content.split(' ').filter(word => word != command.toLowerCase())

                // To get the word to define we simply take the first word in the normalised message
                let word = fullMessage[0]

                // To get the defenition of the new word we take all elements from the first onwards seperating them by a space
                let definition = fullMessage.slice(1).join(' ')

                // To append the new defenition to the file we load the file up
                fs.readFile('./definitions.json', 'utf-8', (err, data) => {

                    // If theres an error throw it
                    if (err) throw err

                    // Load the current information stored in the file
                    let information = JSON.parse(data)

                    // Append the new defenition to the object
                    information.definitions.push({
                        word: word,
                        definition: definition
                    })

                    // Alert the Guild that the bot will be restarting
                    client.guilds.find("name", "Test").channels.find("name", "general").send("Just restarting beep boop and such")

                    // Overwrite the current JSON in the file so it contains the new definition
                    fs.writeFile('./definitions.json', JSON.stringify(information), 'utf-8', (err) => {

                        // If theres an error throw it
                        if (err) throw err

                        // Inform the user that the new definition has been added
                        sender.send(`${word} added to definitions list`)
                    })

                })

                break

            // This command will inform the user of the current username of this bot (feels weird typing in the third person)
            case '!INFO':
                let creator = client.users.get(config.authorID)
                sender.send(`I am a discord bot created by ${creator.username} using the discord.js module!`)
                break

            // This command will grab a list of people with Admin privelages and inform the user of their usernames
            // and will also get a list of people with Admin privelages who are online at the moment
            /*
            TODO:
            1) Rewrite code so it can be used for multiple guilds (possibly) or to find diferent roles
            */
            case '!MODS':
                // Create two strings that will hold the users that are mods / mods who are online at the moment
                let modsResult = 'All Mods: '
                let onlineModsResult = 'All Online Mods: '

                // The reason this line of code is quite long is that when this message was sent through PM it crashed!
                // so to prevent that we get the admins from the context of the guild through the bot rather than the sender of the message
                const allMods = client.guilds.find('name', 'Test').roles.find('name', 'Admin').members

                // This is the list of all mods but filtered to only contain those that are also currently online on discord
                // this doesn't include people on DnD or Idle or Invisible (could filter this but unless the person is online they might not reply?)
                const onlineMods = allMods.filter(mod => mod.user.presence.status == 'online')

                // We add the found mods to the mods result mapping it to only add their username
                // (to avoid people getting loads of notifications from being mentioned all the time)
                modsResult += allMods.map(mod => mod.user.username).join(', ')

                // We do the same as above but this time to the filtered list containing only online mods
                onlineModsResult += onlineMods.map(mod => mod.user.username).join(', ')

                // We then send both lists back to the user
                sender.send(modsResult + '\n \n' + onlineModsResult)
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