const BaseCommand = require('../../Structures/BaseCommand');
const snekfetch = require('snekfetch');
const { Embeds: EmbedsMode } = require('discord-paginationembed');
const chunk = require('lodash.chunk');
const truncate = require('lodash.truncate');

class Repo extends BaseCommand {
	constructor(bot) {
		super({
			command: 'issues',
			aliases: [],
			description: `Get issues from any of our repos`,
			usage: 'issues',
			category: 'Information',
			guildOnly: false,
			hidden: false,
		});
		this.bot = bot;
	}

	execute(msg, args) {
		switch (args.shift().toLowerCase()) {
			case 'all':
				snekfetch.get('https://api.github.com/orgs/MyRPC/issues').then(res => {
					const embeds = []
					const issues = res.body.filter(i => i.state === 'open');

					const issueFields = []

					for (const issue of issues) {
						issueFields.push({
							name: `[${issue.repository.full_name}] - #${issue.number}: ${issue.title}`,
							value: `${truncate(issue.body, 300)}\n**[View On GitHub](${issue.html_url})`,
						});
					}

					issuefields = chunk(issueFields, 10);

					const page = 1;
					for (const issueList of issueFields) {
						const embed = new RichEmbed();
						
						embed.setColor(this.bot.config.embedColor);
						embed.setTitle(`MyRPC Issues - Page ${page}`);
					}
				});
		}
	}
}

module.exports = Repo;