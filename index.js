const Discord = require('discord.js'); // Discord Bot API
var needle = require('needle'); // Twitter API handler
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
    "haynes": "1328796295356551170",
    "koc": "1328836478194114562",
    "shams": "1328795384890728448",
    "stein": "1328780236025180161",
    "woj": "1328619251117252608"
}
const sources = {
    "haynes": "57710919",
    "koc": "35355156",
    "shams": "178580925",
    "stein": "48488561",
    "woj": "50323173"    
}
/**
 * TWEETS = Holds a list of tweets that have been fetched from API but not yet published in server
 */
var tweets = [];

var channelIDs = ["778169140455145472"];

bot.on('tweet', tweets => {
    console.log(channelIDs);
    for (c of channelIDs) {    
        var channel = bot.channels.fetch(c);
        channel.then(function(result) {
            for (tweet of tweets) {
                switch (tweet.author_id) {
                    case sources["haynes"]:
                        result.send("\n**New Tweet from Chris Haynes**\n\nhttps://twitter.com/ChrisBHaynes/status/" + tweet.id);
                        break;
                    case sources["koc"]:
                        result.send("\n**New Tweet from Kevin O'Connor**\n\nhttps://twitter.com/KevinOConnorNBA/status/" + tweet.id);
                        break;
                    case sources["shams"]:
                        result.send('\n**SHAMS BOMB**\n\nhttps://twitter.com/ShamsCharania/status/' + tweet.id);
                        break;
                    case sources["stein"]:
                        result.send('\n**New Tweet from Marc Stein**\n\nhttps://twitter.com/ShamsCharania/status/' + tweet.id);
                        break;
                    case sources["woj"]:
                        result.send('\n**WOJ BOMB**\n\nhttps://twitter.com/TheSteinLine/status/' + tweet.id);
                        break;
                
                    default:
                        break;
                }
            }
        });
    }
	
});

bot.on('message', message => {
    if (message.content === "!here") {
        channelIDs.push(message.channel.id);
    }
    if (message.content === "!channels") {
        console.log(channelIDs);
    }
})

/**
 * Makes a request to Twitter API for any new tweets from @wojespn not including retweets. Repeats every 2000ms
 */
async function getRequest() {

    tweets = []; //Empty Array

    var timeOutPromise = new Promise(function(resolve, reject) {
        // 10 Second delay
        setTimeout(resolve, 10000, 'Timeout Done');
    });

    Promise.all([getTweets("haynes"), getTweets("koc"), getTweets("shams"), getTweets("stein"), getTweets("woj"), timeOutPromise]).then(function(values) {
        try {
            collectData(values[0].body, "haynes");
            collectData(values[1].body, "koc");
            collectData(values[2].body, "shams");
            collectData(values[3].body, "stein");
            collectData(values[4].body, "woj");
        } catch(e) {
            console.log(e);
        }
        if (tweets.length > 0) {
            tweets.sort((a, b) => (a.created_at > b.created_at) ?  1 : -1); //Sort tweets chronoc
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

