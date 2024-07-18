const { SlashCommandBuilder } = require('discord.js');
require("dotenv").config();
const scrapeNews = require('../../scraping/googleNews');
const createNewsEmbed = require('../../embeds/news');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('scrapenews')
        .setDescription('Fetches news articles based on the selected category')
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
        )),
	async execute(interaction) {
        const category = interaction.options.getString('category');
        const categoriesArray = [];
        categoriesArray.push(category);
        await interaction.deferReply();
        try
        {
            const result = await scrapeNews(categoriesArray);
            const articles = result[category].articlesData;

            const embed = createNewsEmbed(category, articles);

            await interaction.editReply({ embeds: [embed] });
        }catch(error){
            console.error(error);
            await interaction.reply('Sorry, there was an error fetching the news articles.');
        }
	},
};