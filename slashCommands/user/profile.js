const { SlashCommandBuilder } = require('discord.js');
require("dotenv").config();
const User = require('../../models/user');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Setup your profile to receive news')
        .addStringOption(option =>
            option.setName('preferences')
                .setDescription('Enter your news preferences (genres of news)')
                .setRequired(true)),        
	async execute(interaction) {
        const preferences = interaction.options.getString('preferences').split(",").map(p => p.trim());
        const user = new User({
            discordId: interaction.user.id,
            username: interaction.user.username,
            preferences: preferences
        })
        let result = await user.save();
        console.log(result);
        await interaction.reply(`Your profile has been created!`);
	},
};