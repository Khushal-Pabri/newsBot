const { EmbedBuilder } = require('discord.js');

function nextNewsTimeEmbed(interaction)
{
    const embed = new EmbedBuilder()
    .setColor(0xFFE600)
    .setTitle(`Hi there ${interaction.user.username}`)
    .setDescription('Please select your news preferences')
    return embed;
}

module.exports = nextNewsTimeEmbed;