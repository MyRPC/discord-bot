module.exports = (bot, event) => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){

        let channel = bot.discordClient.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
			let user = msg.guild.members.get(event.d.user_id);

			if (msg.author.id == bot.discordClient.user.id){
				const re = /\*\*(.+)?(?=\*\*)/;
				const role = msg.content.match(re)[1];

				if (user.id != bot.user.id){
					const roleObj = msg.guild.roles.find(r => r.name === role);
					const memberObj = msg.guild.members.get(user.id);

					if (event.t === "MESSAGE_REACTION_ADD") memberObj.addRole(roleObj);
					else memberObj.removeRole(roleObj);
				}
			}
        });
    }
};