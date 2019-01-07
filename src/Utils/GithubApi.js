const snekfetch = require('snekfetch');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

class GithubApi {
    constructor(clientId, clientSecret) {
        this.apiBase = 'https://api.github.com';

        (async () => {
            const buffer = await promisify(randomBytes)(48);
            const loginId = buffer.toString('hex');

            const res = await snekfetch.post(`${this.apiBase}/authorizations`, {
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
                },
            });

            console.log(res.body);

            this.token = res.body.token;
        })();
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