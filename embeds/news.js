const { EmbedBuilder } = require('discord.js');

function createNewsEmbed(category, articles)
{
    const fields = articles.map((article, index) => ({
        name: `${index + 1}. ${article.title}`,
        value: `[**Read more**](${article.link}) - ${article.time}`,
    }));

    const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`Here are the top news articles for category - ${category}`)
    .setTimestamp()
    .addFields(fields)

    return embed;
}

module.exports = createNewsEmbed;