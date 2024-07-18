const { SlashCommandBuilder } = require('discord.js');
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Replies with a searched gif')
        .addStringOption(option =>
            option.setName('search')
                .setDescription('Search for any gif')
                .setRequired(true)),
	async execute(interaction) {
        const search = interaction.options.getString('search');
        let url = `https://tenor.googleapis.com/v2/search?q=${search}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=1&random=true`
        let response = await fetch(url);
        let json = await response.json();
        console.log(json);
		await interaction.reply(`${json.results[0].url}\n\nGIF for: ${search}`);
	},
};