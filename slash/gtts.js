const {SlashCommandBuilder} = require("@discordjs/builders")
const {useMainPlayer, QueryType} = require("discord-player")
const gTTS = require('gtts')
const {nanoid} = require('nanoid/async')

module.exports = {
    data: new SlashCommandBuilder()
            .setName("gtts")
            .setDescription("Say text out loud")
            .addStringOption((option) => option.setName("text").setDescription("Type the text to be played").setRequired(true)),
    run: async ({client, interaction}) => {
        const player = useMainPlayer()
        let text = interaction.options.getString("text")
        const gtts = new gTTS(text, 'pl')

        const fileName = await nanoid(10)
        gtts.save(`tempAudio/${fileName}.mp3`, async function (err, result){
            if(err) { throw new Error(err); }
            console.log("Text converted into speech");
            await player.play(interaction.member.voice.channel, `tempAudio/${fileName}.mp3`, {
                searchEngine: QueryType.FILE,
                nodeOptions: {
                    metadata: interaction
                }
            })
        });
        
        await interaction.editReply(text)

    }    
}