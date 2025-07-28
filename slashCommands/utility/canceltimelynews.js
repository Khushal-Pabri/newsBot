const { SlashCommandBuilder } = require('@discordjs/builders');
const User = require('../../models/user');
const { cancelExistingJob } = require('../../scraping/scheduleScraping');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('canceltimelynews')
        .setDescription('Stop fetching news'), 

	async execute(interaction) {
        await interaction.deferReply();
        const user = await User.findOne({discordId: interaction.user.id});
        cancelExistingJob(user);
        if(user)
        {
            user.newsInterval = undefined;
            user.scheduledJob = undefined;
            await user.save();

            console.log('Your timely news has been cancled');
        }
        else
        {
            console.log('user not found');
        }
        await interaction.followUp('Timely news has been cancelled!');
	},
};