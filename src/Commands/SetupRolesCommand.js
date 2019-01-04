const BaseCommand = require('../Structures/BaseCommand');

class SetupRoles extends BaseCommand {
	constructor(bot) {
		super({
			command: 'setup-roles',
			aliases: [],
			description: 'Sets up reaction roles',
			category: 'Moderator',
			usage: 'setup-roles',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
	}

    generateMessages(){
        const messages = [];
        messages.push(`**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**`);
        for (const role of this.bot.config.roles) messages.push(`${this.bot.config.emoji[this.bot.config.roles.indexOf(role)]} React below to get the **${role}** role!`); //DONT CHANGE THIS
        return messages;
    }

	execute(msg) {
		if (!msg.author.hasPermission('MANAGE_SERVER')) return;
        var toSend = this.generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (msg, idx) => [msg, this.bot.config.emoji[idx]])];
        for (const mapObj of mappedArray) msg.channel.send(mapObj[0]).then(sent => {
            if (mapObj[1]) sent.react(mapObj[1]);
        });
    }
}

module.exports = SetupRoles;