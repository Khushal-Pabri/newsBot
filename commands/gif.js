module.exports = async function(message, tokens){
    let keywords = "404 error";
    if(tokens.length > 0)
    {
        keywords = tokens.join(" ");
    }
        
    let url = `https://tenor.googleapis.com/v2/search?q=${keywords}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=1&random=true`
    let response = await fetch(url);
    let json = await response.json();
    console.log(json);
    message.channel.send(json.results[0].url);
    message.channel.send(`GIF for: ${keywords}`);
    return;
}