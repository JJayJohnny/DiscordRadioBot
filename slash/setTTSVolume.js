const {SlashCommandBuilder} = require("@discordjs/builders")
const {useQueue} = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
            .setName("set-tts-volume")
            .setDescription("Set the volume of TTS tracks")
            .addIntegerOption((option) => option.setName("volume")
                                                .setDescription("Volume of TTS")
                                                .setMinValue(1)
                                                .setMaxValue(100)
                                                .setRequired(true)),
    run: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id)
        global.ttsVolume = interaction.options.getInteger("volume")
        if(queue){
            //change volume immediately
            const currentTrack = queue.currentTrack       
            if(currentTrack.queryType == 'file'){
                queue.node.setVolume(global.ttsVolume)
                console.log("TTS volume")
            }
        }

        await interaction.editReply(`TTS volume is set to ${global.ttsVolume}`)
    }
}