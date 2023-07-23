const {useQueue, useMainPlayer, QueryType} = require("discord-player")
const http = require('http')
const axios = require('axios')
const FormData = require('form-data')
const gTTS = require('gtts')
const fs = require('fs')
const {nanoid}  = require('nanoid/async')
const LastFM = require('last-fm')

moods = ['happy', 'sad', 'energetic', 'proffesional', 'negative', 'funny', 'relaxing', 'reflective', 'calm', 'angry', 'none']

module.exports = async function generateVoice(track, interaction){
    if(global.serverURL == ""){
        if(global.remindedServerURL == false){
            interaction.channel.send("Remember to set url for language model server")
            global.remindedServerURL = true
        }
        return
    }
    //check if the GPT server is online
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
    bodyFormData.append('prompt', await generatePrompt(track))

    axios({
        method: "post",
        url: "http://"+global.serverURL+'/generate',
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(async function (response) {
          //handle success     
            let text = response.data.message
            console.log(text)
            text = text.split('###')[3]
            text = text.replace(" Prezenter: ", "")
            text = text.replace('"', '')
            // console.log(text)

            const player = useMainPlayer()
            const queue = useQueue(interaction.guild.id)

            const gtts = new gTTS(text, 'pl')

            const fileName = await nanoid(10)
            gtts.save(`tempAudio/${fileName}.mp3`, async function (err, result){
                if(err) { throw new Error(err); }
                console.log("Text convered into speech");
                const searchResult = await player.search(`tempAudio/${fileName}.mp3`, {
                    searchEngine: QueryType.FILE
                })
                const trackIndex = getTrackPositionInQueue(track, interaction)
                console.log(trackIndex)
                if(trackIndex < 0 ){
                    //track is no longer in queue or already started playing
                    fs.unlinkSync(searchResult.tracks[0].url)
                    return
                }
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

async function generatePrompt(track){

    try{
        const lastfm = new LastFM(process.env.LASTFM_KEY)
        let prompt = await new Promise((resolve, reject) => {
            lastfm.trackSearch({q: track.title}, (err, data) => {
                if (err){
                    console.log(err)
                    reject(err)
                }
                else{
                    lastfm.artistInfo({name: data.result[0].artistName}, async (err2, info) => {
                        if(err2){
                            console.log(err2)
                            reject(err2)
                        }
                        else{
                            input = `\nTitle: ${track.title}\nAuthor: ${info.name}`
                            if(info.tags.length != 0) input = input + `\nTags: ${info.tags}`
                            if(info.summary != '') input = input + `\nAuthor info: ${info.summary.split('\n')[0]}`

                            input = input + `\nSeed: ${await nanoid(10)}`

                            resolve(`### Instrukcja: Jesteś prezenterem w radiu. Napisz interesującą zapowiedź następującej piosenki.\n### Input: ${input}\n### Prezenter:`)
                        }
                    })
                }
            })
        })
        return prompt
    }
    catch(e){
        //if anything occurs with lastfm cheat by randomizing prompt
        let mood = moods[Math.floor(Math.random() * moods.length)]
        // let prompt = `Jesteś prezenterem w radiu. Napisz zapowiedź piosenki: "${track.title}" autorstwa "${track.author}". Mood: ${mood}`
    
        //using the Alpaca format
        return `### Instrukcja: Jesteś prezenterem w radiu. Napisz interesującą zapowiedź następującej piosenki.\n### Input:\nTitle: ${track.title}\n Author: ${track.author}\n Mood: ${mood}\n### Prezenter:`
    }
}