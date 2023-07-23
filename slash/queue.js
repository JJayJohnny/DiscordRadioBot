const {SlashCommandBuilder} = require("@discordjs/builders")
const {useQueue} = require("discord-player")
const {EmbedBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Display currently plaing queue"),
    run: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id)
        if(queue == null) return interaction.editReply('There is nothing playing right now')
        const tracks = queue.tracks.toArray()
        const currentTrack = queue.currentTrack

        let embed = new EmbedBuilder()
        embed.setTitle("QUEUE")

        let embedText = ""
        embedText += `Currently playing: ${currentTrack.title} ${currentTrack.duration}\n`

        for(const track of tracks){
            embedText += `${tracks.indexOf(track)+1}. ${track.title} ${track.duration}\n`
        }
        embed.setDescription(embedText)

        return interaction.editReply({
            embeds: [embed]
        })
    }
}