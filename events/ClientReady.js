const{Events, ActivityType} = require('discord.js')

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client){
        console.log(`Logged in as ${client.user.tag}`)

        client.user.setPresence({
            activities: [{name: '/add', type: ActivityType.Listening}],
            status: "online"
        })
    }
}