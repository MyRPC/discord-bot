const { RichEmbed } = require('discord.js');
const snooCore = require('snoocore');

const unescapeJSON = val => {
    if (typeof(val) == "string") val = val.replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">").replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&");
    return val;
};

module.exports = (bot, subreddit, channel) => {
    console.log('starting snoocore');
    let reddit = new snooCore(bot.config.reddit);
    
    reddit.on('error', error => {
        console.error('REDDIT ERROR:');
        console.error(error);
    });
    
    reddit.on('ENOTFOUND', error => {
        console.error('REDDIT ERROR:');
        console.error(error);
    });
    
    const waitFunction = subreddit => {
        setTimeout(function(){
            fetchAnnounce(subreddit);
        }, 60000);
    };
    
    let latestSubmission = 0;
    
    const fetchAnnounce = subreddit => {
        reddit(`/r/${subreddit}/new`).get({
            limit: 1
        }).then(result => {
            if (result.data.children.length === 0) console.log(`ERROR:\n${result}`);
            else {
                const submissionsNew = result.data.children.reverse();
    
                submissionsNew.forEach((value, index) => {
                    const submissionID = value.data.id;
                    
                    const embed = new RichEmbed();
                    embed.setTitle(`r/${value.data.subreddit} - ${unescapeJSON(value.data.title)}`);
                    embed.setAuthor('reddit');
                    embed.setDescription(`${value.data.votes} vote(s) and ${value.data.comments} comment(s) so far on Reddit`);
                    embed.setThumbnail(value.data.thumbnail ? value.data.thumbnail : 'https://a.thumbs.redditmedia.com/cgfaT2eh3dEkaf-smovl78lAiT_MF_xHB0-AfI5UJ70.png');
                    embed.setColor('#7892da');
                    embed.setURL(`https://redd.it/${submissionID}`);
                    
                    var intID = parseInt(submissionID, 36);
                    
                    if (intID > latestSubmission) {
                        const channel = bot.discordClient.channels.get(channel);
                        
                        channel.send(embed).then(msg => {
                            latestSubmission = intID;
                        }).catch(error => console.error('Announce failed:', error));
                    }
                });
            }

            waitFunction(subreddit);
        }).catch(error => {
            console.log('reddit error:', error);
            waitFunction(subreddit);
        });
    };
    
    fetchAnnounce(subreddit);
}