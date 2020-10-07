const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

let botusername = "";
let amongusbericht = "";
let amongususer = "";
let amonguschannel = "";
let amongusbezig = false;

bot.on('ready', async (msg) => {
    console.log("");
    console.log(`Succesvol ingelogd als ${bot.user.tag}!`);
    console.log("");


    bot.user.setPresence({
        status: 'online',
        activity: {
            name: `${prefix}info`,
        }
    })

    botusername = bot.user.username;
});

bot.on("guildCreate", guild => {
    console.log(`Een nieuwe server gebruikt mij: ${guild.name} (id: ${guild.id}). Deze server heeft ${guild.memberCount} gebruikers!`);
});

bot.on("guildDelete", guild => {
    console.log(`Ik ben verwijderd bij: ${guild.name} (id: ${guild.id})`);
});

const data = {
    "embed": {
        "title": "AMONG US COMMANDS:",
        "color": 16426522,
        "author": {
            "name": botusername,
        },
        "fields": [
            {
                "name": `${prefix}info`,
                "value": "Hiermee krijg je alle commands te zien."
            },
            {
                "name": `${prefix}amongus`,
                "value": "Om een potje te starten gebruik je deze command."
            },
            {
                "name": `${prefix}amongusstop`,
                "value": "Je kan een potje hiermee stoppen."
            }
        ]
    }
};

bot.on('message', async msg => {
    if (!msg.content.startsWith(prefix)) return;
    if (msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();


    if (command === "info") {
        msg.channel.send(data);
    }

    if (command === "amongus") {
        //TODO: start among us
        //if (meeting) unmute alle mic (behalve de mensen die dood zijn)
        //anders mute/deaf alle spelers die nog leven, en de doden unmuten
        if (!msg.member.voice.channel) {
            msg.channel.send("Je moet in een voice-channel zitten!");
            return;
        }
        if (!amongusbezig) {
            amongusbezig = true;
            var embed = new Discord.MessageEmbed()
                .setTitle(`Among Us`)
                .setDescription(`Reageer met een :white_check_mark: als er een meeting is, en met een :x: als er geen meeting is`)
                .setFooter(`De host is: ${msg.author.username}\nHet kanaal waarin de game afspeelt is: ${msg.member.voice.channel.name}`)
                .setColor(16426522)

            msg.channel.send({ embed: embed }).then(embedMessage => {
                amongusbericht = embedMessage;
                amongususer = msg.author;
                amonguschannel = msg.member.voice.channel;
                amonguschannel.edit({
                    userLimit: 10,
                });
                embedMessage.react('✅');
                embedMessage.react('❌');
            });


            // msg.channel.send(embed);
            // msg.react('✅').then(r => {
            //     msg.react('❌');
            // });
            // msg.channel.send("Dit command is nog in onderhoud.");
        } else {
            msg.channel.send("Among Us is al bezig!");
        }
    }

    if (command === "amongusstop") {
        if (amongusbezig) {
            if (amongususer.id === msg.author.id) {
                amongusbezig = false;
                var embed = new Discord.MessageEmbed()
                    .setTitle(`Among Us`)
                    .setDescription(`De game is gestopt, doe **${prefix}amongus** om weer een nieuw game te starten.`)
                    .setColor(16426522)

                msg.channel.send({ embed: embed }).then(embedMessage => {
                    amongusbericht = "";
                    amongususer = "";
                    msg.member.voice.channel.edit({
                        userLimit: 0,
                    });
                });

                let channel = amonguschannel;
                for (let member of channel.members) {
                    member[1].edit({ mute: false });
                }




                // msg.channel.send(embed);
                // msg.react('✅').then(r => {
                //     msg.react('❌');
                // });
                // msg.channel.send("Dit command is nog in onderhoud.");
            } else {
                msg.channel.send("Je bent niet bevoegd om deze game te stoppen!");
            }
        } else {
            msg.channel.send("Among Us is nog niet begonnen!");
        }
    }
});


bot.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) return;
    if (user.id != amongususer.id) {
        reaction.remove();
        amongusbericht.react(reaction._emoji.name);
        return;
    };

    if (reaction.message.id === amongusbericht.id) {
        if (reaction._emoji.name === "✅") {
            //unmute iedereen
            reaction.remove();
            amongusbericht.react(reaction._emoji.name);
            let channel = amonguschannel;
            for (let member of channel.members) {
                member[1].edit({ mute: false });
            }
        } else if (reaction._emoji.name === "❌") {
            //mute iedereen
            reaction.remove();
            amongusbericht.react(reaction._emoji.name);
            let channel = amonguschannel;
            for (let member of channel.members) {
                member[1].edit({ mute: true });
            }
        } else {

        }
    }
});

bot.login(token);