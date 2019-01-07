const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const Octokit = require('@octokit/rest');
const chunk = require('lodash.chunk');

const createErrorEmbed = require('./Utils/createErrorEmbed');

class Bot {
    constructor(configPath) {
        this.config = require(configPath);
        this.discordClient = new Discord.Client();

        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        this.octokit = null;
        this.initGithub();

        this.loadCommands();
        this.loadEvents();

        this.discordClient.login(this.config.token);

        process.on('unhandledRejection', err => {
            const errorEmbed = createErrorEmbed(this);
            this.discordClient.channels.get(this.config.errorChannel).send(errorEmbed);
        });

        process.on('uncaughtException', err => {
            const errorEmbed = createErrorEmbed(this, err);
            this.discordClient.channels.get(this.config.errorChannel).send(errorEmbed);
        });
    }

    loadCommands() {
        fs.readdir(path.join(__dirname, 'Commands'), (e, files) => {
            if (e) console.warn(e);

            for (const file of files) {
                if (!file.endsWith('.js')) return;

                const Command = require(`./Commands/${file}`);
                const cmd = new Command(this);

                console.log(`Attempting to load command ${cmd.command}`);
                
                this.commands.set(cmd.command, cmd);
                for (const alias of cmd.aliases) this.aliases.set(alias, cmd.command);
            }
        });
    }

    loadEvents() {
        fs.readdir(path.join(__dirname, 'Events'), (err, files) => {
            if (err) return console.error(err)

            for (const file of files) {
                const event = require(`./Events/${file}`);

                const eventName = file.split('.')[0];
                this.discordClient.on(eventName, event.bind(null, this));

                console.log(`Bound event: ${eventName}`);
                delete require.cache[require.resolve(`./Events/${file}`)];
            }
        });
    }

    initGithub() {
        this.octokit = new Octokit()
        this.octokit.authenticate({
            type: 'oauth',
            key: this.config.apis.github.clientId,
            secret: this.config.apis.github.clientSecret,
        });
    }
}

module.exports = Bot;