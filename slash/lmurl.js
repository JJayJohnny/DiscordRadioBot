const {SlashCommandBuilder} = require("@discordjs/builders")
const {PermissionFlagsBits} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
            .setName("lmurl")
            .setDescription("Set the url to the language model server")
            .addStringOption((option) => option.setName("url").setDescription("URL").setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    run: async ({client, interaction}) => {
        let url = interaction.options.getString("url")
        global.serverURL = url
        await interaction.editReply("Done")
    }
}