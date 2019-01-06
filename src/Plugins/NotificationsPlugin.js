const express = require('express');
const bodyParser = require('body-parser');
const { RichEmbed } = require('discord.js');

class NotificationsPlugin {
	constructor(bot, port = 3000) {
		this.bot = bot;
		
		this.app = express();
		
		this.app.use(bodyParser.json());
		
		this.app.listen(port);
	}
	
	initReddit() {
		this.app.post('/reddit/:channel', (req, res) => {
			const embed = new RichEmbed(req.body);
			embed.setColor(this.bot.config.embedColor);
			embed.setAuthor('Reddit', 'https://i.railrunner16.me/xzAam9h.png');
			embed.setFooter('© MyRPC | Posted At', this.bot.discordClient.user.displayAvatarURL);
			
			const channel = this.bot.discordClient.channels.get(req.params.channel);
			
			channel.send(embed).then(msg => {
				res.sendStatus(200);
			}).catch(e => {
				console.error(e);
				res.status(500).json({
					err: e
				});
			});
		});
	}
}

module.exports = NotificationsPlugin;