module.exports = {
    token: '',
    roles: ['Linux', 'Mac', 'Windows'],
    emoji: ['1️⃣', '2️⃣', '3️⃣'],
    staffRole: 'Staff',
    prefix: '!',
    reddit: {
		userAgent: '/u/yourname and description of what this does.',
		oauth: {
			type: 'script',
			key: '<KEY>',
			secret: '<SECRET>',
			username: '<REDDIT USERNAME>',
			password: '<REDDIT PASSWORD>',
			// make sure to set all the scopes you need.
			scope: ['account', 'creddits', 'edit', 'flair', 'history', 'identity', 'livemanage', 'modconfig', 'modcontributors', 'modflair', 'modlog', 'modmail', 'modothers', 'modposts', 'modself', 'modwiki', 'mysubreddits', 'privatemessages', 'read', 'report', 'save', 'submit', 'subscribe', 'vote', 'wikiedit', 'wikiread']
		}
	},
};