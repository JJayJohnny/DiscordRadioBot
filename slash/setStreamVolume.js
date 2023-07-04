const {SlashCommandBuilder} = require("@discordjs/builders")
const {useQueue} = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
            .setName("set-steram-volume")
            .setDescription("Set the volume of streamed songs")
            .addIntegerOption((option) => option.setName("volume")
                                                .setDescription("Volume of streamed songs")
                                                .setMinValue(1)
                                                .setMaxValue(100)
                                                .setRequired(true)),
    run: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id)
        global.streamVolume = interaction.options.getInteger("volume")
        if(queue){
            //change volume immediately
            const currentTrack = queue.currentTrack       
            if(currentTrack.queryType != 'file'){
                queue.node.setVolume(global.streamVolume)
                console.log("Song volume")
            }
        }

        await interaction.editReply(`Stream volume is set to ${global.streamVolume}`)
    }
}