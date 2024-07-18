const { SlashCommandBuilder } = require('discord.js');
const News = require('../../models/articles');
const createArchivedNewsEmbed = require('../../embeds/archivedNews');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('archivednews')
        .setDescription('Retrives old scraped articles')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Category of news')
                .setRequired(true)
                .addChoices(
                    { name: 'India', value: 'india' },
                    { name: 'World', value: 'world' },
                    { name: 'Business', value: 'business' },
                    { name: 'Technology', value: 'technology' },
                    { name: 'Entertainment', value: 'entertainment' },
                    { name: 'Sports', value: 'sports' },
                    { name: 'Science', value: 'science' },
                    { name: 'Health', value: 'health' },
        ))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('number of articles to retrive')
                .setRequired(true)
            ),
	async execute(interaction) {
        await interaction.deferReply();

        const number = interaction.options.getInteger('amount');
        const category = interaction.options.getString('category');
        console.log(number);
        const result = await News.findOne({category:category}, {articles: { $slice: number }});
        const articles = result ? result.articles : [];
        console.log(articles);
        // const embed = createNewsEmbed(category, articles);

        var i = 0;
        while (i < articles.length)
        {
            const slicedArticles = articles.slice(i , i+9);
            const embed = createArchivedNewsEmbed(category, slicedArticles);
            await interaction.followUp({ embeds: [embed] });
            i = i + 9;
        }
	},
};