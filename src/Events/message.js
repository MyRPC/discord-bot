const createErrorEmbed = require('../Utils/createErrorEmbed');

module.exports = (bot, msg) => {
    if (msg.author.bot) return;

    if (!msg.content.toLowerCase().startsWith(bot.config.prefix)) return;
    const args = msg.content.slice(bot.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let cmd;

    if (bot.commands.has(command)) cmd = bot.commands.get(command);
    else if (bot.aliases.has(command)) cmd = bot.commands.get(bot.aliases.get(command));
    else return;

    if (!cmd) return;
    try {
        cmd.execute(msg, args);
    } catch (e) {
		const errorEmbed = createErrorEmbed(bot, e)
		msg.channel.send(errorEmbed);
    }
};