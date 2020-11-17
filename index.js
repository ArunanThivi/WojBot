const Discord = require('discord.js');
var Twitter = require('twitter');
var needle = require('needle');
const {discordToken, twitterToken, endpointURL} = require('./config.json');

const bot = new Discord.Client();

bot.once('ready', () => {
	console.log('Ready!');
});

var newest_id = 0;
var tweets = [];

bot.on('message', message => {    
    var channel = bot.channels.fetch("778169140455145472")
    channel.then(function(result) {
        if (tweets.length) { 
            result.send('WOJ BOMB\nhttps://twitter.com/wojespn/status/' + tweets.pop());
        }
    });
	
});


async function getRequest() {

    // Edit query parameters below
    const params = {
        'query': 'sources from:50323173 -is:retweet',
    } 

    const res = await needle('get', endpointURL, params, { headers: {
        "authorization": `Bearer ${twitterToken}`
    }})

    if(res.body) {
        return res.body;
    } else {
        throw new Error ('Unsuccessful request')
    }
}

(async () => {

    try {
        const response = await getRequest();
        var data = response.data;
        if (response.meta.newest_id > newest_id) {
            for (tweet of data) {
                if (tweet.id > newest_id) {
                    tweets.push(tweet.id)
                }
            }
            newest_id = response.meta.newest_id;
        }

    } catch(e) {
        console.log(e);
    }
  })();
bot.login(discordToken);
getRequest();
/** 
50323173 - @wojespn twitter ID
178580925 - @Shams twitter ID
"sources from:50323173" <- search rule

*/ 
