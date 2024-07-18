const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require("dotenv").config();

const commands = [];

const foldersPath = path.join(__dirname, 'slashCommands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) 
{
	const commandsPath = path.join(foldersPath, folder);//path of each folder inside slashCommands
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));//all files in the current folder
	for (const file of commandFiles) 
    {
		const filePath = path.join(commandsPath, file);//path of a particular command
		const command = require(filePath);
	
		if ('data' in command && 'execute' in command) 
        {
			commands.push(command.data.toJSON());
		} 
        else 
        {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try 
    {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}catch(error) 
    {
		console.error(error);
	}
})();