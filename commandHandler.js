const ping = require('./commands/ping');
const gif = require('./commands/gif');

const commands = {
    ping: ping,
    gif: gif
}

module.exports = async function (message) {
    if (message.author.bot) {
        // message.suppressEmbeds(true)
        return;
    }
    console.log(message.content);

    let tokens = message.content.split(" ");
    let command = tokens.shift();//shift all the elements in array by 1 and removes the first element
    if(command[0] === "!")
    {
        command = command.slice(1);
        if(commands[command])
        {
            commands[command](message, tokens);
        }
        else
        {
            message.reply("command not found");
        }
    }
    else
    {
        message.reply("hi from NewsBot");
    }
}