const discord = require('discord.js')
const fs = require('fs')
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
            
            case '!DEFENITIONS':
                fs.readFile('./defenition.json', 'utf-8', (err, data) => {
                    if (err) throw err

                    let obj = JSON.parse(data)
                    let result = ''
                    obj.defenitions.forEach(defenition => result += `${defenition.word} : ${defenition.defenition} \n \n`)

                    sender.send(result)
                })
                break

            case '!DEFINE':
                let fullMessage = message.content.split(' ').filter(word => word != command.toLowerCase())
                let word = fullMessage[0]
                let defenition = fullMessage.slice(1).join(" ")

                fs.readFile('./defenition.json', 'utf-8', (err, data) => {
                    if (err) throw err

                    let obj = JSON.parse(data)
                    obj.defenitions.push({
                        word: word,
                        defenition: defenition
                    })

                    fs.writeFile("./defenition.json", JSON.stringify(obj), 'utf-8', (err) => {
                        if (err) throw err

                        sender.send(`${word} added to defenitions list!`)
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