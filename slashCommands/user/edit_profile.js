const { SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
require("dotenv").config();
const User = require('../../models/user');
const preferencesMenu = require('../../selectMenus/preferences.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('edit_profile')
        .setDescription('Make changes to your profile')
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit_preferences')
                .setDescription('Edit your news preferences')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit_time-interval')
                .setDescription('Edit your time interval in which you receive news')
        ),
	async execute(interaction) {
        console.log(interaction.options._subcommand);
        const row = new ActionRowBuilder().addComponents(preferencesMenu);
        if(interaction.options._subcommand == 'edit_preferences')
        {
            await interaction.reply({
                content: 'edit your preferences',
                components: [row],
            });
        }
        // await interaction.reply(`Your profile has been edited`);
	},
};