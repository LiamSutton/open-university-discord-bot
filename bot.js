const fs = require('fs')

module.exports = {
    actions: {
        greetGuild: (client) => {
            client.guilds.find('name', 'Test').channels.find('name', 'general').send('Hello World!')
        },

        commands: {
            hi: (sender) => {
                sender.send(`Hi there ${sender.username} how are you!?`)
            },

            source: (sender) => {
                sender.send(`I am open source, get involved at ${module.exports.information.github}`)
            },

            info: (sender, author) => {
                sender.send(`I am a discord bot created by ${author.username} using Node.Js!`)
            },

            tmas: (sender) => {
                let result = 'TMA LIST: \n \n'
                
                module.exports.information.tmas.forEach(tma => result += `Name: ${tma.name} \nCut-off date:  ${tma.date} \n \n`)

                sender.send(result)
            },

            admins: (client, sender) => {

                let adminsResult = 'All Admins: '
                let onlineAdminsResult = 'All Online Admins: '

                const admins = client.guilds.find('name', 'Test').roles.find('name', 'Admin').members
                const onlineAdmins = admins.filter(admin => admin.user.presence.status == 'online')

                adminsResult += admins.map(admin => admin.user.username).join(', ')
                onlineAdminsResult += onlineAdmins.map(admin => admin.user.username).join(', ')

                sender.send(`${adminsResult} \n \n${onlineAdminsResult}`)
            },

            define: (message, sender) => {
                message = message.split(' ').splice(1)

                let word = message[0]
                let definition = message.splice(1).join(' ')

                fs.readFile('./definitions.json', 'utf-8', (err, data) => {
                    if (err) throw err

                    let information = JSON.parse(data)

                    information.definitions.push({
                        word: word,
                        definition: definition
                    })

                    fs.writeFile('./definitions.json', JSON.stringify(information), 'utf-8', (err) => {
                        if (err) throw err

                        sender.send(`${word} has been added to the definitions list!`)
                    })
                })

            },

            alldefinitions: (sender) => {
                fs.readFile('./definitions.json', 'utf-8', (err, data) => {
                    if (err) throw err

                    let information = JSON.parse(data)

                    let results = ''

                    information.definitions.forEach(definition => results += `${definition.word} : ${definition.definition} \n \n`)

                    sender.send(results)
                })
            },

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
        ]
    }
}