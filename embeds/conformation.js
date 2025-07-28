const { EmbedBuilder } = require('discord.js');

function createConformationEmbed(message)
{
    const embed = new EmbedBuilder()
    .setColor(0x66FF00)
    .setTitle(`${message}`)
    return embed;
}

module.exports = createConformationEmbed;