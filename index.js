const Discord = require("discord.js")
const dotenv = require("dotenv")
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9")
const fs = require("fs")
const  {Player} = require("discord-player")
const { YoutubeExtractor, AttachmentExtractor } = require("@discord-player/extractor")

dotenv.config()

global.serverURL = ""
global.remindedServerURL = false
global.streamVolume = 10
global.ttsVolume = 80

const LOAD_SLASH = process.argv[2] == "loadSlash"

const client = new Discord.Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.IntentsBitField.Flags.GuildVoiceStates
    ]
})

client.slashcommands = new Discord.Collection()
const player = new Player(client, {
    ytdlOptions:{
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
player.extractors.register(YoutubeExtractor, {})
player.extractors.register(AttachmentExtractor, {})

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for(const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if(LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if(LOAD_SLASH){
    const rest = new REST({version: "10"}).setToken(process.env.TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands})
        .then((data) => {
            console.log(`Deployed ${data.length} commands`)
        })
        .catch((err) => {
            console.log(err)
            process.exit(1)
        })
}
else{
    loadEvents()
    client.login(process.env.TOKEN)
}

function loadEvents(){
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))

    for(const file of eventFiles){
        const event = require(`./events/${file}`)

        let receiver;
        if(event.receiver == 'player') receiver = player.events
        else if(event.receiver == 'client') receiver = client
        else continue

        if(event.once) receiver.once(event.name, (...args) => event.execute(...args))
        else receiver.on(event.name, (...args) => event.execute(...args))
    }
}