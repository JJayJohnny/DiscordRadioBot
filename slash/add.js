const {SlashCommandBuilder} = require("@discordjs/builders")
const {EmbedBuilder} = require("discord.js")
const {useMainPlayer} = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("add a song to queue")
        .addStringOption((option) => option.setName("query").setDescription("Type the name of the song").setRequired(true)),
    run: async ({ client, interaction}) => {
        if(!interaction.member.voice.channel)
            return interaction.editReply("You need to be in a voice channel")

        let query = interaction.options.getString("query")

        try{
            const player = useMainPlayer()
            const {track} = await player.play(interaction.member.voice.channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            })
            let embed = new EmbedBuilder()
                    .setTitle("SONG")
                    .setDescription(`[${track.title}](${track.url}) has been added to the queue`)
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: `Duration: ${track.duration}`})
            console.log(track)

            return interaction.editReply({
                embeds: [embed]
        })
        }
        catch(e){
            console.log(e)
        }
    }
}