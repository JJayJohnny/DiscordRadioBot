const {GuildQueueEvent} = require('discord-player')

module.exports = {
    name: GuildQueueEvent.playerStart,
    receiver: 'player',
    async execute(queue, track){
        if(track.queryType == 'file'){
            queue.node.setVolume(global.ttsVolume)
            console.log("TTS volume")
        }
        else{
            queue.node.setVolume(global.streamVolume)
            console.log("Song volume")
        }
    }
}