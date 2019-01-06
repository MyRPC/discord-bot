const snekfetch = require('snekfetch');

class GithubApi {
    constructor(clientId, clientSecret) {
        this.apiBase = 'https://api.github.com';

        require('crypto').randomBytes(48, function(err, buffer) {
            if (err) throw err;

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
            }).catch(e => {
                throw e;
            });
        });
    }

    getAllIssuesFromOrg(org) {
        return new Promise((resolve, reject) => {
            snekfetch
            .set('Authorization', `token ${this.token}`)
            .get(`${this.apiBase}/orgs/${org}/issues`)
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }

    getAllIssuesFromRepo(user, repo) {
        return new Promise((resolve, reject) => {
            snekfetch
            .set('Authorization', `token ${this.token}`)
            .get(`${this.apiBase}/repos/${user}/${repo}/issues`)
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }

    getAllIssuesFromRepoByNumber(user, repo, number) {
        return new Promise((resolve, reject) => {
            snekfetch
            .set('Authorization', `token ${this.token}`)
            .get(`${this.apiBase}/repos/${user}/${repo}/issues/${number}`)
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }

    getOrg(org) {
        return new Promise((resolve, reject) => {
            snekfetch
            .set('Authorization', `token ${this.token}`)
            .get(`${this.apiBase}/orgs/${org}`)
            .then(res => resolve(res.body))
            .catch(err => reject(err));
        });
    }
}

module.exports = GithubApi;