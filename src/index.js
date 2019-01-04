const Bot = require('./bot');
const redditPlugin = require('./Plugins/redditPlugin');

const bot = new Bot('./config');

redditPlugin(bot, 'FreeGamesOnSteam', '529511559177830400');
redditPlugin(bot, 'FreeGameFindings', '529511559177830400');