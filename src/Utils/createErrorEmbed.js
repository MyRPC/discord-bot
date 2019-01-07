const { RichEmbed } = require('discord.js');

module.exports = (bot, e) => {
    const embed = new RichEmbed()
    .setTitle('ERROR')
    .setDescription(`\`\`\`${e}\`\`\``)
    .setFooter('© MyRPC', bot.discordClient.user.displayAvatarURL)
    .setTimestamp(new Date())
    .setColor('#dd4535')
    const errString = err.toString();
    const charList = errString.split('');

    const chunkedCharList = chunk(charList, 1018);

    for (const newCharList of chunkedCharList) embed.addField('Stack Trace', `\`\`\`${newCharList.join('')}\`\`\``);

    return embed;
};