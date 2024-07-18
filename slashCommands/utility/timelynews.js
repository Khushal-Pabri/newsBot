const { SlashCommandBuilder } = require('@discordjs/builders');
const User = require('../../models/user');
const { scheduleUserJob } = require('../../scraping/scheduleScraping');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('timelynews')
        .setDescription('Fetch News at each time interval specified')
        .addStringOption(option =>
            option.setName('interval')
                .setDescription('Enter time interval to fetch news at each interval')
                .setRequired(true)),   

	async execute(interaction) {
        await interaction.deferReply();

        const newsInterval = interaction.options.getString('interval');
        const discordId = interaction.user.id;
        const channelId = interaction.channelId;
        const user = await User.findOne({ discordId });
        if (!user) {
            await interaction.reply('Please set your preferences first using /profile2.');
            return;
        }
        user.newsInterval = newsInterval;
        user.channelId = channelId;
        await user.save();

        const { preferences } = user;

        scheduleUserJob(user, interaction.client);
	},
};