const {SlashCommandBuilder} = require("@discordjs/builders")
const {useMainPlayer, QueryType} = require("discord-player")
const gTTS = require('gtts')

module.exports = {
    data: new SlashCommandBuilder()
            .setName("gtts")
            .setDescription("Say text out loud")
            .addStringOption((option) => option.setName("text").setDescription("Type the text to be played").setRequired(true)),
    run: async ({client, interaction}) => {
        const player = useMainPlayer()
        let text = interaction.options.getString("text")
        const gtts = new gTTS(text, 'pl')

        gtts.save(`tempAudio/${text}.mp3`, async function (err, result){
            if(err) { throw new Error(err); }
            console.log("Text convered into speech");
            await player.play(interaction.member.voice.channel, `tempAudio/${text}.mp3`, {
                searchEngine: QueryType.FILE
            })
        });

        await interaction.editReply(text)

    }    
}