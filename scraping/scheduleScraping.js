const User = require('../models/user');
const scrapeNews = require('./googleNews');
const schedule = require('node-schedule');
const createNewsEmbed = require('../embeds/news');
const createErrorEmbed = require('../embeds/error');

async function cancelExistingJob(user) {
    const {scheduledJob} = user;
    if(!scheduledJob) return;
    const job = schedule.scheduledJobs[scheduledJob];
    if (job) {
        job.cancel();
        console.log("old job cancelled");
    }
}

async function scheduleUserJob(user, interactionClient)
{
    await cancelExistingJob(user);
    const { discordId, newsInterval, preferences, channelId} = user;
    console.log(preferences);
    const jobName = `${discordId}-${Date.now()}`;
    user.scheduledJob = jobName;
    await user.save();

    const job = schedule.scheduleJob(jobName,`*/${newsInterval} * * * *`, async () => {
        try
        {
            const result = await scrapeNews(preferences);
            for(category of preferences)
            {
                const articles = result[category].articlesData;

                const embed = createNewsEmbed(category, articles);
                const channel = await interactionClient.channels.fetch(channelId);
                await channel.send({ embeds: [embed] });
            }
        }catch(error){
            console.error(error);
            const channel = await interactionClient.channels.fetch(channelId);
            const message = 'Sorry, there was an error fetching the news articles.'
            const errorEmbed = createErrorEmbed(message);
            await channel.send({ embeds: [errorEmbed] });
        }
    });
}

async function loadAndScheduleJobs(interactionClient) {
    const users = await User.find({ newsInterval: { $exists: true } });

    users.forEach(user => {
        scheduleUserJob(user, interactionClient);
    });
}

module.exports = {scheduleUserJob, loadAndScheduleJobs, cancelExistingJob};