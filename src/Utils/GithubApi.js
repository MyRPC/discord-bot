const snekfetch = require('snekfetch');

class GithubApi {
    constructor(token) {
        this.token = token;
        this.apiBase = 'https://api.github.com';
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