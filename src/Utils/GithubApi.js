const snekfetch = require('snekfetch');

class GithubApi {
    constructor(clientId, clientSecret) {
        this.apiBase = 'https://api.github.com';

        require('crypto').randomBytes(48, function(err, buffer) {
            if (err) console.warn(err);

            const loginId = buffer.toString('hex');
            snekfetch.post(`${this.apiBase}/authorzations`, {
                data: {
                    scopes: [
                        'repo',
                        'admin:org',
                        'user',
                        'gists',
                    ],
                    client_id: clientId,
                    client_secret: clientSecret,
                    note: `Login To API`,
                    fingerPrint: loginId,
                }
            }).then(res => {
                this.token = res.body.token;
            }).catch(e => console.warn);

            console.log(this.token);
        });
    }

    getOrgIssues(org) {
        return new Promise((resolve, reject) => {
            snekfetch
            .get(`${this.apiBase}/orgs/${org}/issues`, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            })
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }

    getRepoIssues(owner, repo) {
        return new Promise((resolve, reject) => {
            snekfetch
            .get(`${this.apiBase}/repos/${owner}/${repo}/issues`, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            })
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }

    getIssue(owner, repo, number) {
        return new Promise((resolve, reject) => {
            snekfetch
            .get(`${this.apiBase}/repos/${owner}/${repo}/issues/${number}`, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            })
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }

    getOrg(org) {
        return new Promise((resolve, reject) => {
            snekfetch
            .get(`${this.apiBase}/orgs/${org}`, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            })
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }

    getIssueComments(owner, repo, number) {
        return new Promise((resolve, reject) => {
            snekfetch.get(`${this.apiBase}/repos/${owner}/${repo}/issues/${number}/comments`, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            })
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }
}

module.exports = GithubApi;