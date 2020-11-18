var events = require('events'); // EventEmitter Handler
const Discord = require('discord.js'); // Discord Bot API
var Twitter = require('twitter'); // Twitter API
var needle = require('needle'); // REST API handler
const {discordToken, twitterToken, endpointURL} = require('./config.json'); // API tokens

const bot = new Discord.Client();

bot.once('ready', () => {
    console.log('Ready!');
    bot.user.setActivity('NBA Free Agency', { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
    .catch(console.error);
});
/**
 * NEWEST_ID = Holds the id of the most recent tweet recieved. 
 */
var latest = {
    "woj": "1328619251117252608",
    "shams": "1328795384890728448"
}
const sources = {
    "woj": "50323173",
    "shams": "178580925"
}
/**
 * TWEETS = Holds a list of tweets that have been fetched from API but not yet published in server
 */
var tweets = [];

var channelID = "778169140455145472";

bot.on('tweet', tweets => {
   // if (channelID != null) {    
        var channel = bot.channels.fetch(channelID);
        channel.then(function(result) {
            let tweet = tweets.pop();
            if (tweet.author_id == sources["shams"]) {
                result.send('\n**SHAMS BOMB**\n\nhttps://twitter.com/ShamsCharania/status/' + tweet.id);
            } else if (tweet.author_id == sources["woj"]) {
                result.send('\n**WOJ BOMB**\n\nhttps://twitter.com/wojespn/status/' + tweet.id);
            }
            });
    //} else {
   //     console.log("Channel not set! Use !here to set a channel!");
   // }
	
});

bot.on('message', message => {
    if (message.content === "!here") {
        channelID = message.channel.id;
    }
})

/**
 * Makes a request to Twitter API for any new tweets from @wojespn not including retweets. Repeats every 2000ms
 */
async function getRequest() {

    var timeOutPromise = new Promise(function(resolve, reject) {
        // 2 Second delay
        setTimeout(resolve, 4000, 'Timeout Done');
    });

    Promise.all([getTweets("woj"), getTweets("shams"), timeOutPromise]).then(function(values) {
        try {
            collectData(values[0].body, "woj");
            collectData(values[1].body, "shams");
        } catch(e) {
            console.log(e);
        }
        if (tweets.length > 0) {
            tweets.sort((a, b) => (a.created_at < b.created_at) ?  1 : -1); //Sort tweets chronoc
            bot.emit('tweet', tweets);
        }
        getRequest(); //Repeat Call
    });
};

async function getTweets(author) {
    const params = {
        'query':`sources from:${sources[author]} -is:retweet`,
        'tweet.fields': 'author_id,created_at'
    }
    
        return await needle('get', endpointURL, params, { headers: {
        "authorization": `Bearer ${twitterToken}`
    }});
}

function collectData(data, author) {
    if (data.meta.newest_id > latest[author]) {
        for (tweet of data.data) {
            if (tweet.id > latest[author]) {
                tweets.push(tweet)
            }
        }
        latest[author] = data.meta.newest_id;
    }
}

getRequest();
bot.login(discordToken);

