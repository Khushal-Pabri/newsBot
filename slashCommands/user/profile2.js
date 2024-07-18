const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require('discord.js');
require("dotenv").config();
const User = require('../../models/user');
const preferencesMenu = require('../../selectMenus/preferences.js');
const createProfileEmbed = require('../../embeds/profile.js');

module.exports = {
        data: new SlashCommandBuilder()
        .setName('profile2')
        .setDescription('Setup your profile to receive news'),

	async execute(interaction) {
        const embed = createProfileEmbed(interaction);
        const row = new ActionRowBuilder().addComponents(preferencesMenu);
        await interaction.reply({
                embeds: [embed],
                components: [row],
        });
},
};