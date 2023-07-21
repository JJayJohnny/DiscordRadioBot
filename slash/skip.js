const {SlashCommandBuilder} = require("@discordjs/builders")
const {useQueue} = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip curretnly playing track"),
    run: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id)
        queue.node.skip()
        const nextTrack = queue.tracks.toArray()[0]
        if(nextTrack)
            await interaction.editReply(`Skipped -> ${nextTrack.title}`)
        else
            await interaction.editReply(`End of queue`)
    }
}