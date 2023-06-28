const {SlashCommandBuilder} = require("@discordjs/builders")
const {useQueue} = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
            .setName("quit")
            .setDescription("Stop the player, clear queue and leave voice channel"),
    run: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id)

        if(queue)
            queue.delete()

        await interaction.editReply("Bye")

    }    
}