const { EmbedBuilder } = require('discord.js');

function createArchivedNewsEmbed(category, articles)
{
    const fields = articles.map((article, index) => ({
        name: `${index + 1}. ${article.title}`,
        value: `[**Read more**](${article.link})`,
    }));

    const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`Here are the archived news articles for category - ${category}`)
    .setTimestamp()
    .addFields(fields)

    return embed;
}

module.exports = createArchivedNewsEmbed;