const Bot = require('./bot');
const redditPlugin = require('./Plugins/redditPlugin');

const bot = new Bot('./config');

bot.loadPlugin(redditPlugin);