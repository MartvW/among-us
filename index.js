const Discord = require('discord.js');
const { token } = require('./config.json');
const bot = new Discord.Client();

var prefix = "-";

bot.on('ready', () => {
    console.log("");
    console.log(`Succesvol ingelogd als ${bot.user.tag}`);
    console.log("");

    bot.user.setPresence({
        status: 'online',
        activity: {
            name: `${prefix}info`,
        }
    })
});

bot.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return;
    if (msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ + /);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        msg.channel.send("Pong");
    }

    if (command === "amongus") {
        if (!msg.member.voice.channel) {
            msg.channel.send("Je moet in een voice-channel zitten!");
            return;
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(`Among Us`)
            .setDescription(`Reageer met een :white_check_mark: als er een meeting is en met een :x: als er geen meeting is`)
            .setFooter(`De host is: ${msg.author.username}\nHet kanaal waarin de game wordt gehouden is: ${msg.member.voice.channel.name}`)
            .setColor(16426522)

        msg.channel.send({ embed: embed }).then(embedMesage => {
            msg.member.voice.channel.edit({
                userLimit: 10,
            });
        });
    }

});

bot.login(token);