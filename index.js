var events = require('events'); // EventEmitter Handler
const Discord = require('discord.js'); // Discord Bot API
var Twitter = require('twitter'); // Twitter API
var needle = require('needle'); // REST API handler
const {discordToken, twitterToken, endpointURL} = require('./config.json'); // API tokens

const bot = new Discord.Client();

bot.once('ready', () => {
	console.log('Ready!');
});
/**
 * NEWEST_ID = Holds the id of the most recent tweet recieved. 
 */
var newest_id = 0;
/**
 * TWEETS = Holds a list of tweets that have been fetched from API but not yet published in server
 */
var tweets = [];

bot.on('tweet', tweets => {    
    var channel = bot.channels.fetch("778169140455145472")
    channel.then(function(result) {
        result.send('\n**WOJ BOMB**\n\nhttps://twitter.com/wojespn/status/' + tweets.pop());
    });
	
});

/**
 * Makes a request to Twitter API for any new tweets from @wojespn not including retweets. Repeats every 2000ms
 */
async function getRequest() {

    const params = {
        'query':"sources from:50323173 -is:retweet",
    } 

    const res = await needle('get', endpointURL, params, { headers: {
        "authorization": `Bearer ${twitterToken}`
    }})

    var timeOutPromise = new Promise(function(resolve, reject) {
        // 2 Second delay
        setTimeout(resolve, 2000, 'Timeout Done');
    });

    Promise.all([res, timeOutPromise]).then(function(values) {
        try {
            var data = values[0].body.data;
            if (values[0].body.meta.newest_id > newest_id) {
                for (tweet of data) {
                    if (tweet.id > newest_id) {
                        tweets.push(tweet.id)
                    }
                }
                newest_id = values[0].body.meta.newest_id;
            }
        } catch(e) {
            console.log(e);
        }
        if (tweets.length > 0) {
            bot.emit('tweet', tweets);
        }
        getRequest(); //Repeat Call
    });
};

getRequest();
bot.login(discordToken);

/** 
50323173 - @wojespn twitter ID
178580925 - @Shams twitter ID
"sources from:50323173" <- search rule
*/ 
