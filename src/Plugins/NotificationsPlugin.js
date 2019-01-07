const express = require('express');
const bodyParser = require('body-parser');
const { RichEmbed } = require('discord.js');

const GithubApi = require('../Utils/GithubApi')

class NotificationsPlugin {
	constructor(bot, port = 3000) {
		this.bot = bot;
		
		this.app = express();
		this.app.use(bodyParser.json());
		this.app.listen(port);

		this.github = new GithubApi(bot.config.apis.github.clientId, bot.config.apis.github.clientSecret);
	}
	
	initReddit() {
		this.app.post('/webhooks/reddit/:channel', (req, res) => {
			const embed = new RichEmbed(req.body);
			embed.setColor(this.bot.config.embedColor);
			embed.setAuthor('Reddit', 'https://i.railrunner16.me/xzAam9h.png');
			embed.setFooter('© MyRPC | Posted At', this.bot.discordClient.user.displayAvatarURL);
			
			const channel = this.bot.discordClient.channels.get(req.params.channel);
			
			channel.send(embed).then(msg => {
				res.status(200).json({
					message: 'success',
					sent: msg,
				});
			}).catch(err => {
				res.status(500).json({
					message: 'error',
					error: err
				});
			});
		});
	}

	initGithub() {
		this.app.post('/webhooks/github/:channel', (req, res) => {
			const eventData = req.body;

			const embed = new RichEmbed();
			switch (req.headers['X-GitHub-Event']) {
				case 'issue':
					switch (eventData.action) {
						case 'opened':
							embed.setColor(this.bot.config.embedColor);
							embed.setTitle(`[${eventData.repository.full_name}] - Issue #${eventData.issue.number} Opened:`);
							embed.setURL(eventData.issue.html_url);
							embed.setDescription(`${eventData.issue.title}\n${eventData.issue.body}`);
							embed.setAuthor('GitHub', 'https://i.railrunner16.me/gbc3lr1.png');
							embed.setFooter('© MyRPC', this.bot.discordClient.user.displayAvatarURL);
							embed.addField('Opened By', `[${eventData.sender.login}](${eventData.sender.html_url})`, true)

							this.github.getIssueComments('MyRPC', eventData.repository.name, eventData.issue.number).then(comments => {
								embed.addField('Comments', comments.length.toString());
							}).catch(e => console.warn);
							break;
						default:
							res.sendStatus(200);
							return;
					}
					break;
				default:
					res.sendStatus(200);
					return;
			}

			const channel = this.bot.discordClient.channels.get(req.params.channel);
			channel.send(embed).then(msg => {
				res.status(200).json({
					message: 'success',
					sent: msg,
				});
			}).catch(err => {
				res.status(500).json({
					message: 'error',
					error: err
				});
			});
		});
	}
}

module.exports = NotificationsPlugin;