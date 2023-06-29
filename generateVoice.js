const {useQueue, useMainPlayer, QueryType} = require("discord-player")
const http = require('http')
const axios = require('axios')
const FormData = require('form-data')
const gTTS = require('gtts')

module.exports = async function generateVoice(track, interaction){
    if(global.serverURL == "")
        return
    http.get({timeout: 1000, host: global.serverURL}, (res) => {
        data = ''
        res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try{
                let json = JSON.parse(data)
                if(json.status != 'OK')
                    return
            }catch(err){
                console.log('Response is not JSON')
                return
            }
          });
    }).on('timeout', () => {
        request.destroy()
        console.log('Text server not active')
        return
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        return
    });

    console.log('Text server active')

    let bodyFormData = new FormData()
    bodyFormData.append('prompt', `Jesteś prezenterem w radiu. Napisz zapowiedź piosenki: "${track.title}" autorstwa "${track.author}".`)

    axios({
        method: "post",
        url: "http://"+global.serverURL+'/generate',
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          //handle success     
            let text = response.data.message
            text = text.split('###')[2]
            text = text.replace(" Prezenter: ", "")
            text = text.replace('"', '')
            console.log(text)

            const player = useMainPlayer()
            const queue = useQueue(interaction.guild.id)

            const gtts = new gTTS(text, 'pl')

            const number = Math.floor(Math.random() * (999999999 - 100000000) + 100000000)
            gtts.save(`tempAudio/${number.toString()}.mp3`, async function (err, result){
                if(err) { throw new Error(err); }
                console.log("Text convered into speech");
                const searchResult = await player.search(`tempAudio/${number.toString()}.mp3`, {
                    searchEngine: QueryType.FILE
                })
                const trackIndex = getTrackPositionInQueue(track, interaction)
                console.log(trackIndex)
                if(trackIndex < 0 )
                    return
                queue.insertTrack(searchResult.tracks[0], trackIndex)
            });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          return
        });
}

function getTrackPositionInQueue(track, interaction){
    const queue = useQueue(interaction.guild.id)
    let tracks = queue.tracks.toArray()

    return tracks.indexOf(track)
}