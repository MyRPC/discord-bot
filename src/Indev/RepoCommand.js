const BaseCommand = require('../../Structures/BaseCommand');

class Repo extends BaseCommand {
	constructor(bot) {
		super({
			command: 'repo',
			aliases: [],
			type: 'Info',
			description: `Get repo information from repos in our GitHub org. do \`${bot.config.prefix}repo help\` for more info.`,
			usage: 'repo help',
			category: 'Information',
			guildOnly: false,
			hidden: false,
		});
		this.bot = bot;
	}

	execute(msg) {
	}
}

module.exports = Repo;