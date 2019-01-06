const { RichEmbed } = require('discord.js');

module.exports = (bot, e) => new RichEmbed()
    .setTitle('ERROR')
    .setDescription(`\`\`\`${e}\`\`\``)
    .setFooter('© MyRPC', bot.discordClient.user.displayAvatarURL)
    .setTimestamp(new Date())
    .setColor('#dd4535')
    .addField('Stack Trace', `\`\`\`${e.stack}\`\`\``)