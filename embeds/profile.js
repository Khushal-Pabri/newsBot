const { EmbedBuilder } = require('discord.js');

function createProfileEmbed(interaction)
{
    const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`Hi there ${interaction.user.username}`)
    .setDescription('Please select your news preferences')
    return embed;
}

module.exports = createProfileEmbed;