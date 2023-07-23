const {SlashCommandBuilder} = require('@discordjs/builders')
const {EmbedBuilder} = require('discord.js')
const {useQueue} = require('discord-player')
const {lyricsExtractor}  = require('@discord-player/extractor')

module.exports = {
    data: new SlashCommandBuilder()
            .setName('lyrics')
            .setDescription('Find lyrics of currently playing song'),
    run: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id)
        if(queue == null) return interaction.editReply('There is nothing playing right now')
        const currentTrack = queue.currentTrack
        
        if(currentTrack.queryType == 'file') return interaction.editReply("You can't search lyrics for that")

        const lyricsFinder = lyricsExtractor()
        const lyrics = await lyricsFinder.search(currentTrack.title).catch(() => null)

        if (!lyrics) return interaction.editReply("No lyrics found ):")

        const embed = new EmbedBuilder()
            .setTitle(lyrics.title)
            .setURL(lyrics.url)
            .setThumbnail(lyrics.thumbnail)
            .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url
            })
            .setDescription(lyrics.lyrics)
        
        return interaction.editReply({
            embeds: [embed]
        })
    }
}