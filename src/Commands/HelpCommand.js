const { RichEmbed } = require('discord.js');
const BaseCommand = require('../Structures/BaseCommand');

class Help extends BaseCommand {
	constructor(bot) {
		super({
			command: 'help',
			aliases: [
                'cmds',
                'commands',
                'halp',
            ],
			type: 'Information',
			description: `Get help with bot commands.`,
			usage: 'help',
			category: 'Information',
			guildOnly: false,
			hidden: false,
		});
		this.bot = bot;

		this.emotes = {
			Utility: ':wrench:',
			Information: ':newspaper:',
			Moderator: ':shield:',
		};
	}

	execute(msg) {
		const categories = {};
		this.bot.commands.filter(command => !command.hidden).forEach(command => {
			if (!(command.category in categories)) categories[command.category] = [];
			categories[command.category].push(command.command);
		});

		const embed = new RichEmbed();

		embed.setColor(this.bot.config.embedColor);
		embed.setTitle('MyRPC - Commands');
		embed.setFooter('© MyRPC', this.bot.discordClient.user.displayAvatarURL);

		for (const categoryCommands of categories) embed.addField(`${this.emotes[category]} | ${category}`, categoryCommands.map(c => `**${c}**`).join(', '));

		msg.channel.send(embed);
	}
}

module.exports = Help;