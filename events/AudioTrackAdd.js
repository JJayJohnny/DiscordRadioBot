const {GuildQueueEvent} = require('discord-player')
const generateVoice = require('../generateVoice')

module.exports = {
    name: GuildQueueEvent.audioTrackAdd,
    receiver: 'player',
    async execute(queue, track){
        // Emitted when the player adds a single song to its queue
    if(queue.currentTrack == null)
        console.log('First track')
    else{
        console.log('Not first track')
        if(track.queryType != 'file')
            generateVoice(track, queue.metadata)
        }
    }
}