const Discord = require('discord.js'); // Discord Bot API
var Monitor = require('./monitor');
const { discordToken, consumer_key, consumer_secret, access_token, access_token_secret } = require('./keys.json');

var config = {
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
};

var m = new Monitor(config);
const bot = new Discord.Client();

var channelIDs = ["778169140455145472"]; //746209966662352896 Berkeley server  778169140455145472 Test Server

bot.once('ready', () => {
  console.log('Ready!');
  bot.user.setActivity('Harden Trade Talks', { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
    .catch(console.error);
});

bot.login(discordToken);


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

m.on('ChrisBHaynes', function (tweet) {
  for (c of channelIDs) {
    var channel = bot.channels.fetch(c);
    channel.then(function (result) {
      result.send("__New Tweet from **Chris Haynes**__\n\n https://twitter.com/ShamsCharania/status/" + tweet.id);
    }).catch(console.error);
  }
  console.log('SHAMS BOMB', tweet);
});

m.on('TheSteinLine', function (tweet) {
  for (c of channelIDs) {
    var channel = bot.channels.fetch(c);
    channel.then(function (result) {
      result.send("__New Tweet from **Marc Stein**__\n\n https://twitter.com/TheSteinLine/status/" + tweet.id);
    }).catch(console.error);
  }
  console.log('SHAMS BOMB', tweet);
});

m.start('wojespn', 'Harden', 10 * 1000);
m.start('ShamsCharania', 'Harden', 10 * 1000);
m.start('TheSteinLine', 'Harden', 10 * 1000);
m.start('ChrisBHaynes', 'Harden', 10 * 1000);