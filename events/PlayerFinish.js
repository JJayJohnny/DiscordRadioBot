const {GuildQueueEvent} = require('discord-player')
const fs = require("fs")

module.exports = {
    name: GuildQueueEvent.playerFinish,
    receiver: 'player',
    async execute(queue, track){
        if(track.queryType == 'file'){
            fs.unlinkSync(track.url)
        }
    }
}