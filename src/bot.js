const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

class Bot {
    constructor(configPath) {
        this.config = require(configPath);
        this.discordClient = new Discord.Client();

        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        this.loadCommands();
        this.loadEvents();

        this.discordClient.login(this.config.token);
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
}

module.exports = Bot;