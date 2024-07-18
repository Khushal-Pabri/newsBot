const { SlashCommandBuilder } = require('discord.js');
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Replies with articles related to searched news topic')
        .addStringOption(option =>
            option.setName('search')
                .setDescription('Search for any topic')
            ),
	async execute(interaction) {
        const search = interaction.options.getString('search');
        let url = `https://newsapi.org/v2/top-headlines?apiKey=${process.env.NEWS_API}&language=en&pageSize=20&category=business`
        let response = await fetch(url);
        let json = await response.json();
        console.log(json);
        console.log(search);
        const random = Math.floor(Math.random() * json.articles.length);
        const article = json.articles[random];
		await interaction.reply(`${article.title}\n\n${article.url}`);
	},
};