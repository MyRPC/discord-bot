const BaseCommand = require('../Structures/BaseCommand');
const truncateString = require('../Utils/truncateString');
const createErrorEmbed = require('../Utils/createErrorEmbed');
const GithubApi = require('../Utils/GithubApi');

const snekfetch = require('snekfetch');
const { RichEmbed } = require('discord.js');
const { Embeds: EmbedsMode } = require('discord-paginationembed');
const chunk = require('lodash.chunk');

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
		this.github = new GithubApi(bot.config.apis.github.clientId, bot.config.apis.github.clientSecret);
	}

	async execute(msg, args) {
		if (!args) return msg.channel.send(`You must use a valid subcommand. Do **${this.bot.config.prefix}issues help** for a list of commands.`);
		const { data: org } = await this.bot.octokit.orgs.get({
			org: 'MyRPC'
		})
		this.ghOrg = org;
		
		switch (args.shift().toLowerCase()) {
			case 'all':
				let { data: issues } = await this.bot.octokit.issues.listForOrg({
					org: 'MyRPC', 
					state: 'open'
				});

				const embeds = [];
				issues = issues.filter(i => i.state === 'open' && !i.pull_request);
				const issueFields = [];

				for (const issue of issues) issueFields.push({
					name: `[${issue.repository.full_name}] - #${issue.number}: ${issue.title}`,
					value: `${truncateString(issue.body, 300)}\n**[View On GitHub](${issue.html_url})**`,
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
				break;
			case 'repo':
				const repoName = args.shift();
				let { data: issues2 } = await this.bot.octokit.issues.listForRepo({
					owner: 'MyRPC',
					repo: repoName
				});
				const embeds2 = [];
				issues2 = issues2.filter(i => i.state === 'open' && !i.pull_request);
				let issueFields2 = [];

				for (const issue of issues2) issueFields2.push({
					name: `[MyRPC/${repoName}] - #${issue.number}: ${issue.title}`,
					value: `${truncateString(issue.body, 300)}\n**[View On GitHub](${issue.html_url})**`,
				});

				issueFields2 = chunk(issueFields, 10);

				let page2 = 1;
				for (const issueList of issueFields) {
					const embed = new RichEmbed();
					
					embed.setColor(this.bot.config.embedColor);
					embed.setTitle(`MyRPC/${repoName} Issues - Page ${page2}`);
					embed.setFooter(`© MyRPC | Page ${page2}`, this.bot.discordClient.user.displayAvatarURL);
					embed.setThumbnail(this.ghOrg.avatar_url);
					
					for (const issue of issueList) embed.addField(issue.name, issue.value);
					
					embeds2.push(embed);
					
					page2++;
				}
				
				new EmbedsMode()
				.setArray(embeds2)
				.setAuthorizedUsers([msg.author.id])
				.setChannel(msg.channel)
				.build();
				break;
			case 'get':
				const repoName2 = args.shift();
				const issueNumber = args.shift();
				const { data: issue } = await this.octokit.issues.get({
					owner: 'MyRPC', 
					repo: repoName2,
					number: issueNumber
				});
				const embed = new RichEmbed();
				embed.setURL(issue.html_url);
				embed.setTitle(`[MyRPC/${repoName2}] - #${issueNumber}: ${issue.title}`);
				embed.setDescription(truncateString(issue.body, 1022));
				embed.setColor(this.bot.config.embedColor);
				embed.setAuthor(issue.user.login, issue.user.avatar_url, issue.user.html_url);
				embed.setFooter('© MyRPC', this.bot.discordClient.user.displayAvatarURL);
				embed.addField('Comments', issue.comments, true);
				embed.addField('Locked?', issue.locked ? 'Yes' : 'No', true);
				if (issue.locked) embed.addField('Lock Reason', issue.active_lock_reason);
				embed.addField('Labels', issue.labels.length ? issue.labels.map(l => `\`${l.name}\``).join(', ') : 'None');
				
				msg.channel.send(embed);
				break;
			case 'help':
				const embed = new RichEmbed();
				embed.setColor(this.bot.config.embedColor);
				embed.setTitle('Issues - Help');
				embed.setFooter('© MyRPC', this.bot.discordClient.user.displayAvatarURL);
				embed.addField('All', `Get issues from all of our repositories.\n**Usage:**\`${this.bot.config.prefix}issues all\``);
				embed.addField('Repo', `Get issues from a specific repository.\n**Usage:**\`${this.bot.config.prefix}issues repo <repo>\``);
				embed.addField('Get', `Get a specific issue.\n**Usage:**\`${this.bot.config.prefix}issues get <repo> <issueNum>\``);
				embed.addField('Help', `Show this help page.\n**Usage:**\`${this.bot.config.prefix}issues help\``);

				msg.channel.send(embed);
				break;
			default:
				msg.channel.send(`That was not recognised as a valid subcommand. Do **${this.bot.config.prefix}issues help** for a list of commands.`);
				break;
		}
	}
}

module.exports = Issues;