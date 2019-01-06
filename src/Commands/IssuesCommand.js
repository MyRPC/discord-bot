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
		this.ghOrg = null;
	}

	execute(msg, args) {
		snekfetch.get('https://api.github.com/orgs/MyRPC').then(res => {
			this.ghOrg = res.body;
		}).catch(e => {
			const errorEmbed = new RichEmbed()
			.setTitle('ERROR')
			.setDescription(`\`\`\`${e}\`\`\``)
			.setFooter('© MyRPC', this.bot.discordClient.user.displayAvatarURL)
			.setTimestamp(new Date())
			.setColor('#dd4535')
			.addField('Stack Trace', Error.captureStackTrace(e));
			
			msg.channel.send(errorEmbed);
		});
		
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
				}).catch(e => {
					const errorEmbed = new RichEmbed()
					.setTitle('ERROR')
					.setDescription(`\`\`\`${e}\`\`\``)
					.setFooter('© MyRPC', this.bot.discordClient.user.displayAvatarURL)
					.setTimestamp(new Date())
					.setColor('#dd4535')
					.addField('Stack Trace', Error.captureStackTrace(e));
					
					msg.channel.send(errorEmbed);
				});
				break;
			case 'repo':
				const repoName = args.shift();
				snekfetch.get(`https://api.github.com/repos/MyRPC/${repoName}/issues`).then(res => {
					const embeds = [];
					const issues = res.body.filter(i => i.state === 'open');
					const issueFields = [];

					for (const issue of issues) issueFields.push({
						name: `[MyRPC/${repoName}] - #${issue.number}: ${issue.title}`,
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
					.setTitle('ERROR')
					.setDescription(`\`\`\`${e}\`\`\``)
					.setFooter('© MyRPC', this.bot.discordClient.user.displayAvatarURL)
					.setTimestamp(new Date())
					.setColor('#dd4535')
					.addField('Stack Trace', Error.captureStackTrace(e));
					
					msg.channel.send(errorEmbed);
				});
				break;
		}
	}
}

module.exports = Issues;