module.exports = {
    actions: {
        greetGuild: (client) => {
            client.guilds.find('name', 'Test').channels.find('name', 'general').send('Hello World!')
        }
    }
}