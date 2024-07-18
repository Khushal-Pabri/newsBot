const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('To check if bot is alive'),
	async execute(interaction) {
		await interaction.reply("pong");
	},
};
