const {SlashCommandBuilder} = require("@discordjs/builders")
const {useQueue} = require("discord-player")
const fs = require('fs')
const path = require('path')

const directory = 'tempAudio'

module.exports = {
    data: new SlashCommandBuilder()
            .setName("quit")
            .setDescription("Stop the player, clear queue and leave voice channel"),
    run: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id)

        if(queue){
            queue.delete()
            //delete all temp files
            fs.readdir(directory, (err, files) => {
                if (err) throw err;
              
                for (const file of files) {
                  fs.unlink(path.join(directory, file), (err) => {
                    if (err) throw err;
                  });
                }
            });
        }

        await interaction.editReply("Bye")

    }    
}