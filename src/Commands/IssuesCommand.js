const BaseCommand = require('../Structures/BaseCommand');
const snekfetch = require('snekfetch');
const { RichEmbed } = require('discord.js');
const { Embeds: EmbedsMode } = require('discord-paginationembed');
const chunk = require('lodash.chunk');
const truncate = require('lodash.truncate');

class Issues extends BaseCommand {
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
		
		snekfetch.get('https://api.github.com/orgs/MyRPC').then(res => {
			this.ghOrg = res.body;
		});
	}

	execute(msg, args) {
		switch (args.shift().toLowerCase()) {
			case 'all':
				snekfetch.get('https://api.github.com/orgs/MyRPC/issues').then(res => {
					const embeds = [];
					const issues = res.body.filter(i => i.state === 'open');
					const issueFields = [];

					for (const issue of issues) issueFields.push({
						name: `[${issue.repository.full_name}] - #${issue.number}: ${issue.title}`,
						value: `${truncate(issue.body, 300)}\n**[View On GitHub](${issue.html_url})`,
					});

					issueFields = chunk(issueFields, 10);

					const page = 1;
					for (const issueList of issueFields) {
						const embed = new RichEmbed();
						
						embed.setColor(this.bot.config.embedColor);
						embed.setTitle(`MyRPC Issues - Page ${page}`);
						embed.setFooter(`© MyRPC | Page ${page}`, this.bot.discordClient.user.displayAvatarURL);
						embed.setThumbnail(this.ghOrg.avatar_url);
						
						for (const issue of issueList) embed.addField(issue.name, issue.value);
						
						embeds.push(embed);
					}
					
					new EmbedsMode()
						.setArray(embeds)
						.setAuthorizedUsers([msg.author.id])
						.setChannel(msg.channel)
						.build();
				});
				break;
			case 'repo':
				const repoName = args.shift().toLowerCase();
				snekfetch.get(`https://api.github.com/repos/MyRPC/${repoName}/issues`).then(res => {
					const embeds = [];
					const issues = res.body.filter(i => i.state === 'open');
					const issueFields = [];

					for (const issue of issues) issueFields.push({
						name: `[${issue.repository.full_name}] - #${issue.number}: ${issue.title}`,
						value: `${truncate(issue.body, 300)}\n**[View On GitHub](${issue.html_url})`,
					});

					issueFields = chunk(issueFields, 10);

					const page = 1;
					for (const issueList of issueFields) {
						const embed = new RichEmbed();
						
						embed.setColor(this.bot.config.embedColor);
						embed.setTitle(`MyRPC/${repoName} Issues - Page ${page}`);
						embed.setFooter(`© MyRPC | Page ${page}`, this.bot.discordClient.user.displayAvatarURL);
						embed.setThumbnail(this.ghOrg.avatar_url);
						
						for (const issue of issueList) embed.addField(issue.name, issue.value);
						
						embeds.push(embed);
					}
					
					new EmbedsMode()
						.setArray(embeds)
						.setAuthorizedUsers([msg.author.id])
						.setChannel(msg.channel)
						.build();
				}).catch(e => {
					const errorEmbed = new RichEmbed()
					.setColor(this.bot.config.embedColor)
					.setDescription(`**Unable to find repo \`${repoName}\` in the \`MyRPC\` org.**`);
					
					msg.channel.send(errorEmbed);
				});
				break;
		}
	}
}

module.exports = Issues;