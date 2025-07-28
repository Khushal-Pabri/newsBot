//discord.js
const { Client, GatewayIntentBits, Collection} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');

//mongo db
const connectDB = require('./config/db');
connectDB();
const User = require('./models/user');

//scraping job
const { loadAndScheduleJobs, scheduleUserJob, cancelExistingJob } = require('./scraping/scheduleScraping')

//embeds
const createConformationEmbed = require('./embeds/conformation');

client.on('ready', async (c) => {
    console.log(`Logged in as ${c.user.tag}!`);
	//load and schedule jobs
	await loadAndScheduleJobs(client);
});

client.on('messageCreate', async (message) => {
});

//new command handler(slash commands)
client.commands = new Collection();//collection extens map class of javascript

const foldersPath = path.join(__dirname, 'slashCommands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);//path of each folder inside slashCommands
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));//all files in the current folder
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);//path of a particular command
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//slash command interaction
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) 
    {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

    try 
    {
		await command.execute(interaction);
	}catch(error)
    {
		console.error(error);
		if (interaction.replied || interaction.deferred) 
        {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} 
        else 
        {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

//select menu interaction
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isStringSelectMenu()) return;
	if (interaction.customId === 'starter')
	{
		console.log(interaction.values);
	}

	let user = await User.findOne({discordId: interaction.user.id});
	if(user)
	{
		console.log(user);
		user.preferences = interaction.values;	
		await user.save();
		console.log("updating profile")
		await scheduleUserJob(user, interaction.client);
		const message = "Your profile has been updated!"
		const embed = createConformationEmbed(message);
		await interaction.reply({ embeds: [embed] });
	}
	else
	{
		const user = new User({
			discordId: interaction.user.id,
			username: interaction.user.username,
			preferences: interaction.values
		})
		await user.save();
		const message = "Your profile has been created!"
		const embed = createConformationEmbed(message);
		await interaction.reply({ embeds: [embed] });
	}
});

client.login(process.env.DISCORD_TOKEN);
module.exports = client;