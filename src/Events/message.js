module.exports = (bot, msg) => {
    if (msg.author.bot) return;

    if (msg.content.toLowerCase().startsWith(bot.config.prefix)) return;
    const args = msg.content.slice(bot.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let Cmd;

    if (bot.commands.has(command)) Cmd = bot.commands.get(command);
    else if (bot.aliases.has(command)) Cmd = bot.commands.get(bot.aliases.get(command));
    else return;

    if (!Cmd) return;
    
    const cmd = new Cmd(bot);
    cmd.execute(msg);
};