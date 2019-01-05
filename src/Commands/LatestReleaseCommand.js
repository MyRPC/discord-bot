const BaseCommand = require('../Structures/BaseCommand');
const snekfetch = require('snekfetch');
const { RichEmbed } = require('discord.js');

class LatestRelease extends BaseCommand {
    constructor(bot) {
        super({
            command: 'latest-release',
            aliases: [
                'latest',
            ],
            description: 'Get information on the latest GitHub release.',
            usage: 'latest-release',
            category: 'Info',
            hidden: false,
            guildOnly: false,
        });
        this.bot = bot;
    }
    
    execute(msg) {
        snekfetch.get('https://api.github.com/repos/RailRunner166/MyRPC/releases/latest').then(res => {
            const release = res.body;
            
            const embed = new RichEmbed;
            
            embed.setColor(this.bot.config.embedColor);
            embed.setTitle(`Release v${release.tag_name} - ${release.name}`);
            embed.setURL(release.html_url);
            embed.setDescription(release.body.replace(/\r\n/, '\n'));
            embed.setAuthor(release.author.login, release.author.avatar_url, release.author.html_url);
            embed.setFooter('Created At', 'https://i.railrunner16.me/YrKVVz4.png');
            embed.setThumbnail('https://i.railrunner16.me/YrKVVz4.png');
            embed.setTimestamp(release.created_at);
            embed.addField('Draft?', release.draft ? 'Yes' : 'No', true);
            embed.addField('Pre-release?', release.prerelease ? 'Yes' : 'No', true);
            
            let downloadsBody = '';
            for (const download of release.assets) downloadsBody += `[${download.name}](${download.browser_download_url})\n`;
            embed.addField('Downloads', downloadsBody);
            
            msg.channel.send(embed);
        });
    }
}

module.exports = LatestRelease;
