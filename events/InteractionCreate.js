const {Events} = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    receiver: 'client',
    async execute(interaction){
        if(!interaction.isCommand())
            return
        const client = interaction.client
        const slashcmd = client.slashcommands.get(interaction.commandName)
        if(!slashcmd)
            interaction.reply("Not a valid command")
        await interaction.deferReply()
        await slashcmd.run({client, interaction})
    }
}