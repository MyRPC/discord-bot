const Bot = require('./bot');
const NotificationsPlugin = require('./Plugins/NotificationsPlugin');

const bot = new Bot('./config');

const notifs = new NotificationsPlugin(bot, process.env.PORT);

notifs.initReddit();