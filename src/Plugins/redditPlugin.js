const { RichEmbed } = require('discord.js');
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const unescapeJSON = val => {
    if (typeof(val) == "string") val = val.replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">").replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&");
    return val;
};

module.exports = (bot, subreddit, channel) => {
    const r = new Snoowrap({
        userAgent: 'node:myrpc-discord-poster:v1.0.0 (by /u/RailRunner16)',
        clientId: bot.config.reddit.clientId,
        clientSecret: bot.config.reddit.clientSecret,
        username: bot.config.reddit.username,
        password: bot.config.reddit.password,
    });
    const client = new Snoostorm(r);
    
    var submissionStream = client.SubmissionStream({
        subreddit,
        results: 1
    });
    
    submissionStream.on("submission", data => {
        const embed = new RichEmbed();
        embed.setTitle(`r/${data.subreddit} - ${unescapeJSON(data.title)}`);
        embed.setAuthor('reddit');
        embed.setDescription(`${data.votes} vote(s) and ${data.comments} comment(s) so far on Reddit`);
        embed.setThumbnail(data.thumbnail ? data.thumbnail : 'https://a.thumbs.redditmedia.com/cgfaT2eh3dEkaf-smovl78lAiT_MF_xHB0-AfI5UJ70.png');
        embed.setColor(this.bot.config.embedColor);
        embed.setURL(`https://redd.it/${data.id}`);
    });
};