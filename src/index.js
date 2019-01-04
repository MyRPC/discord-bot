const Bot = require('./bot');
const redditPlugin = require('./Plugins/redditPlugin');

const bot = new Bot('./config');

bot.loadPlugin(redditPlugin, 'FreeGamesOnSteam', '529511559177830400');
bot.loadPlugin(redditPlugin, 'FreeGameFindings', '529511559177830400');