const Discord = require('discord.js'); // Discord Bot API
var Monitor = require('monitor-twitter');
const { discordToken, consumer_key, consumer_secret, access_token, access_token_secret } = require('./keys.json');

var config = {
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
};

var m = new Monitor(config);
const bot = new Discord.Client();

var channelIDs = ["778169140455145472", "778799485131161640", "746209966662352896"];

bot.once('ready', () => {
  console.log('Ready!');
  bot.user.setActivity('NBA Free Agency', { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
    .catch(console.error);
});

bot.login(discordToken);

bot.on('message', message => {
  if (message.content === "|here") {
    if (channelIDs[message.channel.id] == null) {
      channelIDs.push(message.channel.id);
    }
  }
  if (message.content === "|channels") {
    console.log(channelIDs);
  }
  if (message.content === "|remove") {
    if (channelIDs[message.channel.id] == null) {
      channelIDs.splice(channelIDs.indexOf(message.channel.id), 1);
    }
  }
})

// Watch the account 'wojespn' for Tweets containing 'source' every 30 seconds.


m.on('wojespn', function (tweet) {
  for (c of channelIDs) {
    var channel = bot.channels.fetch(c);
    channel.then(function (result) {
      result.send("__New Tweet from **Adrian Wojnarowski**__\n\n https://twitter.com/wojespn/status/" + tweet.id);
    }).catch(console.error);
  }
  console.log('WOJ BOMB', tweet);
});



m.on('ShamsCharania', function (tweet) {
  for (c of channelIDs) {
    var channel = bot.channels.fetch(c);
    channel.then(function (result) {
      result.send("__New Tweet from **Shams Charania**__\n\n https://twitter.com/ShamsCharania/status/" + tweet.id);
    }).catch(console.error);
  }
  console.log('SHAMS BOMB', tweet);
});

m.start('wojespn', 'source', 10 * 1000);
m.start('ShamsCharania', 'source', 10 * 1000);