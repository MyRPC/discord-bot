class BaseCommand {
	constructor(options) {
		this.command = options.command;
		this.aliases = options.aliases;
		this.description = options.description;
		this.usage = options.usage;
		this.category = options.category;
		this.hidden = options.hidden;
		this.guildOnly = options.guildOnly;
	}
}

module.exports = BaseCommand;