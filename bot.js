// For things that require writing or reading files we use the fs module
const fs = require('fs')

// To use all of the bots functions in the main application file we export it and then import it and store it in a variable
module.exports = {

    // All actions the bot performs
    actions: {

        // This will send a greeting message to a specified server in the specified guild
        greetGuild: (client) => {
            client.guilds.find('name', 'Test').channels.find('name', 'general').send('Hello World!')
        },


        // All commands the bot can perform
        commands: {

            // This will simply PM the user greeting them
            hi: (sender) => {
                sender.send(`Hi there ${sender.username} how are you!?`)
            },

            // This will PM the user a link to the projects github repository
            source: (sender) => {
                sender.send(`I am open source, get involved at ${module.exports.information.github}`)
            },

            // This will PM the user informing them of my current username and also that the discord.js module was used in building this bot
            info: (sender, author) => {
                sender.send(`I am a discord bot created by ${author.username} using Node.Js and the Discord.js module!`)
            },

            // This will PM the user a list of all the TMA's for the module by iterating over the stored data about them
            tmas: (sender) => {
                let result = 'TMA LIST: \n \n'
                
                module.exports.information.tmas.forEach(tma => result += `Name: ${tma.name} \nCut-off date:  ${tma.date} \n \n`)

                sender.send(result)
            },

            // This will PM the user a list of all admins on the server and a seperate list containing all the currently online admins
            admins: (client, sender) => {

                // Two strings to hold the results of the searches
                let adminsResult = 'All Admins: '
                let onlineAdminsResult = 'All Online Admins: '

                // We get a list of all the guilds admins through the bot by finding the specific role in the guild then getting all members that have that role
                const admins = client.guilds.find('name', 'Test').roles.find('name', 'Admin').members

                // We then filter that data into a new list which only contains the admins that have their status as online
                const onlineAdmins = admins.filter(admin => admin.user.presence.status == 'online')

                // We append the appropriate lists to the appropriate result strings, seperating them by a comma and space
                adminsResult += admins.map(admin => admin.user.username).join(', ')
                onlineAdminsResult += onlineAdmins.map(admin => admin.user.username).join(', ')

                // We then PM these two strings to the user
                sender.send(`${adminsResult} \n \n${onlineAdminsResult}`)
            },

            // This allows the user to teach the bot a new definition
            define: (message, sender) => {

                // Get the definition by separating all the words in the message into a list then grabbing the 1st to last index
                // (to avoid the command being in the message)
                message = message.split(' ').splice(1)

                // The word that the user wants to define will be the zeroth item in the list
                let word = message[0]
                
                // The definition for the new word will be everything else in the message so we seperate the word from its definition
                // and then grab the rest of the message and join the words with a space to make it look like a natural sentence
                let definition = message.splice(1).join(' ')

                // The list of all current definitions is then loaded up
                fs.readFile('./definitions.json', 'utf-8', (err, data) => {

                    // If theres an error reading the file throw it
                    if (err) throw err

                    // Capture all of the current definition data into a variable
                    let information = JSON.parse(data)

                    // Push the new word and definition into the current data
                    information.definitions.push({
                        word: word,
                        definition: definition
                    })

                    // Write the data to the existing file so that it includes the new definitions
                    fs.writeFile('./definitions.json', JSON.stringify(information), 'utf-8', (err) => {

                        // If theres an error writing to the file throw it
                        if (err) throw err

                        // PM the user letting them know the new definition was added correctly
                        sender.send(`${word} has been added to the definitions list!`)
                    })
                })

            },

            // This allows the user to query the list of known definitions for a specific word
            defenition: (message, sender) => {

                // To get the word of the definition the user is searching for we seperate the message and grab the second item
                // (to avoid the command being searched for)
                let searchTerm = message.split(' ')[1]

                // The list of all currently known definitions is loaded up
                fs.readFile('./definitions.json', 'utf-8', (err, data) => {
                    
                    // If theres an error reading the file throw it
                    if (err) throw err

                    // Capture the definition data into a variable
                    let information = JSON.parse(data)

                    // To find the definition we filter the data into a new list only adding the item where the definitions word matches the search term
                    let find = information.definitions.filter(definition => definition.word == searchTerm)[0]

                    // If the definition was unable to be found it would return undefined so this is checked for
                    let found = find != undefined

                    // If the word was found PM the word and its definition to the user, otherwise inform them of this
                    if (found) {
                        sender.send(`${find.word} : ${find.definition}`)
                    } else {
                        sender.send('Hmmm I dont have a definition for that, if you figure it out you can teach it me by using the !define command')
                    }
                })
            },

            // This allows the user to recieve a list of all known definitions
            alldefinitions: (sender) => {

                // The file containing all current definitions is loaded
                fs.readFile('./definitions.json', 'utf-8', (err, data) => {

                    // If theres an error reading the file throw it
                    if (err) throw err

                    // Capture all the definition data in a variable
                    let information = JSON.parse(data)

                    // Create an empty string to hold the list of definitions
                    let results = ''

                    // we iterate through the list each time adding the word and its definition to the string formated and seperated
                    information.definitions.forEach(definition => results += `${definition.word} : ${definition.definition} \n \n`)
                    
                    // When this is all over the definitions are sent to the user through PM
                    sender.send(results)
                })
            },

            help: (sender) => {
                let results = 'List of available commands: \n \n'

                module.exports.information.commandList.forEach(command => results += `${command.name} : ${command.information} \n \n`)

                sender.send(results)
            },

            // If a command isnt recognised a PM is sent to the user encouraging them to use the !help command
            unknown: (sender) => {
                sender.send('Hmm.. I dont understand that command, to get a list of all my commands type !help')
            }
        }
    },

    information: {
        github: 'https://github.com/LiamSutton/discord-bot',
        
        tmas: [
            {
                name: 'TMA 01',
                date: '7th December 2017'
            },

            {
                name: 'TMA 02',
                date: '22nd February 2018'
            },

            {
                name: 'TMA 03',
                date: '3rd May 2018'
            }
        ],

        commandList: [
            {
                name: '!hi',
                information: 'This command will greet the sender'
            },

            {
                name: '!admins',
                information: 'This command will list all of the Admins on the server and all of the Admins that are currently online'
            },

            {
                name: '!source',
                information: 'This command will give a link to the projects github repository'
            },

            {
                name: '!define',
                information: 'This command lets the user teach the bot a word and its definition, eg: !define test this is a test definition'
            },

            {
                name: '!alldefinitions',
                information: 'This command will give a list of all the words and definitions the bot currently knows'
            },

            {
                name: '!definition',
                information: 'This command lets the user seach for a specific word to see if the bot knows the definition, eg: !definition test'
            },

            {
                name: '!tmas',
                information: 'This command will give a list of all the TMA\'s for this module including their cut-off dates'
            },

            {
                name: '!info',
                information: 'This command will give the user information such as the creators current user name and the modules used to build the bot'
            },

            {
                name: '!help',
                information: 'Well i\'m sure you can guess what this command does!, it will give you a list of all the commands you can tell me'
            }
        ]
    }
}