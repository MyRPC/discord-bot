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
            const embed = new RichEmbed();
            embed.setColor(this.bot.config.embedColor);
            embed.setTimestamp(req.body.time);
            embed.setAuthor('Reddit', 'https://i.railrunner16.me/xzAam9h.png', 'https://reddit.com');
            embed.setTitle(`r/${req.body.subreddit} - ${req.body.name}`);
            embed.setFooter('© MyRPC | Posted At', this.bot.discordClient.user.displayAvatarURL);
            embed.setURL(req.body.url);
            
            if (req.body.thumb) embed.setThumbnail(req.body.thumb);
            if (req.body.body) embed.setDescription(req.body.body);
            
            this.bot.discordClient.channels.get(req.query.channel).send(embed);
        });
    }
}

module.exports = NotificationsPlugin;