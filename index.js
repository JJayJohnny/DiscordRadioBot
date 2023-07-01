const Discord = require("discord.js")
const dotenv = require("dotenv")
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9")
const fs = require("fs")
const  {Player} = require("discord-player")
const { YoutubeExtractor, AttachmentExtractor } = require("@discord-player/extractor")
const generateVoice = require('./generateVoice')

dotenv.config()

global.serverURL = ""

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

player.events.on('playerFinish', (queue, track) => {
    // Emitted when the player starts to play a song
    if(track.queryType == 'file'){
        fs.unlinkSync(track.url)
    }
});

player.events.on('audioTrackAdd', (queue, track) => {
    // Emitted when the player adds a single song to its queue
    if(queue.currentTrack == null)
        console.log('First track')
    else{
        console.log('Not first track')
        if(track.queryType != 'file')
            generateVoice(track, queue.metadata)
    }
});

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for(const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    commands.push(slashcmd.data.toJSON())
}

client.on("ready", () => {
    const guildIDs = client.guilds.cache.map(guild => guild.id)
    const rest = new REST({version: "9"}).setToken(process.env.TOKEN)
    console.log("Deploying slash commands")
    for(const guildID of guildIDs){
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildID), {body: commands})
        .then(() => {
            console.log(`Added commands to ${guildID}`)
        })
        .catch((err) => {
            if(err){
                console.log(err)
                process.exit(1)
            }
        })
    }
    console.log(`Logged in as ${client.user.tag}`)
})

client.login(process.env.TOKEN)

client.on("interactionCreate", (interaction) => {
    async function handleCommand(){
        if(!interaction.isCommand())
            return
        const slashcmd = client.slashcommands.get(interaction.commandName)
        if(!slashcmd)
            interaction.reply("Not a valid command")
        await interaction.deferReply()
        await slashcmd.run({client, interaction})
    }
    handleCommand()
})


