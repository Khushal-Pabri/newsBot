const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = new StringSelectMenuBuilder()
.setCustomId('starter')
.setPlaceholder('Make a selection!')
.setMinValues(1)
.setMaxValues(8)
.addOptions(
    { label: 'India', value: 'india' },
    { label: 'World', value: 'world' },
    { label: 'Business', value: 'business' },
    { label: 'Technology', value: 'technology' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Sports', value: 'sports' },
    { label: 'Science', value: 'science' },
    { label: 'Health', value: 'health' },                    
);