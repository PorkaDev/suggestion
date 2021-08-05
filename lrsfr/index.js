const Discord = require('discord.js');
const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION']
});
const config = require('./config.json');
const fs = require('fs');
const yt = require('ytdl-core');
const { send, cpuUsage } = require('process');

var list = []

client.login(config.token);
client.commands = new Discord.Collection();

client.on("message", async msg => {
    if (msg.author.bot) return;
    if (msg.content.startsWith(config.prefix + config.cmdSuggest) && msg.channel === client.channels.cache.get(config.channelSend)) {
        const suggestEmbed = new Discord.MessageEmbed() 
            .setTimestamp()
            .setColor( '#f0a300' )
            .setAuthor('Voici la suggestion de ' + msg.author.tag, msg.author.avatarURL() )
            .setTitle('Une nouvelle suggestion !')
            .setDescription(msg.content.replace(config.prefix + config.cmdSuggest, " "))
            .setFooter(msg.author.tag)        
        client.channels.cache.get(config.channelReceive).send(suggestEmbed).then(embedMessage => {
            embedMessage.react('✅')
            embedMessage.react('❌')
            msg.delete();
        });
    }
    if (msg.member.hasPermission('ADMINISTRATOR')) {
        if (msg.content.startsWith(config.prefix + config.cmdRefuse) && msg.channel === client.channels.cache.get(config.channelStaff)) {
            const rsuggestEmbed = new Discord.MessageEmbed() 
                .setTimestamp()
                .setColor(  '#C70039 ' )
                .setAuthor('Refusé par ' + msg.author.tag, msg.author.avatarURL() )
                .setTitle('Suggestion Refusé !')
                .setDescription(msg.content.replace(config.prefix + config.cmdRefuse, " "))
                .setFooter(msg.author.tag)   
    
            client.channels.cache.get(config.channelReceive).send(rsuggestEmbed).then(embedMessage => {
                msg.delete();
            });
        };
    }
    if (msg.member.hasPermission('ADMINISTRATOR')){
        if (msg.content.startsWith(config.prefix + config.cmdAccept) && msg.channel === client.channels.cache.get(config.channelStaff)) {
            const asuggestEmbed = new Discord.MessageEmbed() 
                .setTimestamp()
                .setColor(  '#00c109 ' )
                .setAuthor('Accepté par ' + msg.author.tag, msg.author.avatarURL() )
                .setTitle('Suggestion Accepté !')
                .setDescription(msg.content.replace(config.prefix + config.cmdAccept, " "))
                .setFooter(msg.author.tag) 
            client.channels.cache.get(config.channelReceive).send(asuggestEmbed).then(embedMessage => {
                msg.delete();
            }); 
        };
    }
    if (msg.content.startsWith(config.prefix + config.cmdBugs) && msg.channel === client.channels.cache.get(config.channelSend)) {
        const bugsEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor('#C70039')
            .setAuthor(msg.author.tag, msg.author.avatarURL())
            .setTitle('Nouveau bug trouvé !')
            .setDescription(msg.content.replace(config.prefix + config.cmdBugs, ' '))
            .setFooter(msg.author.tag)
        client.channels.cache.get(config.channelBugs).send(bugsEmbed).then(embedMessage => {
            msg.delete();
        });
    }
    if (msg.member.hasPermission('BAN_MEMBERS')){
        if (msg.content.startsWith(config.prefix + config.cmdBan)){
            let mention = msg.mentions.members.first();

            if(mention === undefined){
                const invalidUser = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setColor("#C70039")
                    .setAuthor(msg.author.tag, msg.author.avatarURL())
                    .setTitle('Invalide !')
                    .setDescription('Le membre identifié est introuvable ou mal inscris, réessayez !')
                    .setFooter(msg.author.tag)
                msg.channel.send(invalidUser)
                msg.delete()
            }
            else{
                mention.ban();
                const banUser = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setColor("#00c109")
                    .setAuthor(msg.author.tag, msg.author.avatarURL())
                    .setTitle('Validé !')
                    .setDescription('Le membre ' + mention.displayName + " a été banni du serveur avec succès !")
                    .setFooter(msg.author.tag)
                msg.channel.send(banUser)
                msg.delete()
            };
        };
    }
    if (msg.member.hasPermission('KICK_MEMBERS')){
        if (msg.content.startsWith(config.prefix + config.cmdKick)){
            let mention = msg.mentions.members.first();

            if(mention === undefined){
                const invalidUser = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setColor("#C70039")
                    .setAuthor(msg.author.tag, msg.author.avatarURL())
                    .setTitle('Invalide !')
                    .setDescription('Le membre identifié est introuvable ou mal inscris, réessayez !')
                    .setFooter(msg.author.tag)
                msg.channel.send(invalidUser)
                msg.delete()
            }
            else{
                mention.kick();
                const kickUser = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setColor("#00c109")
                    .setAuthor(msg.author.tag, msg.author.avatarURL())
                    .setTitle('Validé !')
                    .setDescription('Le membre ' + mention.displayName + " a été expulsé du serveur avec succès !")
                    .setFooter(msg.author.tag)
                msg.channel.send(kickUser)
                msg.delete()
            };
        };
    }
    if (msg.member.hasPermission('MUTE_MEMBERS')){
        if (msg.content.startsWith(config.prefix + config.cmdMute)) {
            let mention = msg.mentions.members.first();

            if (mention === undefined){
                msg.reply('Membre invalide')
                msg.delete()
            }
            else {
                mention.roles.add(config.idMuted);
                msg.channel.send(mention.displayName + " a été mute avec succès")
                const Muted = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor(msg.author.tag, msg.author.avatarURL())
                    .setTitle('Effectué !')
                    .setDescription(mention.displayName + " a été mute avec succès")
                    .setColor(" #148f77 ")
                    .setFooter(msg.author.tag)
                msg.channel.send(Muted)
                msg.delete()
            };
        };
    }
    if (msg.member.hasPermission('MUTE_MEMBERS')){
        if (msg.content.startsWith(config.prefix + config.cmdUnMute)) {
            let mention = msg.mentions.members.first();

            if (mention === undefined){
                msg.reply('Membre invalide')
                msg.delete()
            }
            else {
                mention.roles.remove(config.idMuted);
                const UnMuted = new Discord.MessageEmbed()
                        .setTimestamp()
                        .setAuthor(msg.author.tag, msg.author.avatarURL())
                        .setTitle('Effectué !')
                        .setDescription(mention.displayName + " a été démute avec succès !")
                        .setColor(" #884ea0 ")
                        .setFooter(msg.author.tag)
                msg.channel.send(UnMuted)
                msg.delete()
            }
        }
    }
    if (msg.member.hasPermission('MUTE_MEMBERS')){
        if (msg.content.startsWith(config.prefix + config.cmdTempmute)) {
            let mention = msg.mentions.members.first();

            if (mention === undefined){
                msg.reply('Membre invalide')
                msg.delete()
            }
            else {
                let args = msg.content.split(" ");

                mention.roles.add(config.idMuted)
                const Muted = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor(msg.author.tag, msg.author.avatarURL())
                    .setTitle('Fini !')
                    .setDescription('Le mute temporaire sur ' + mention.displayName + ' à bien été effectué avec ' + args[2] + ' secondes')
                    .setColor(" #148f77 ")
                    .setFooter(msg.author.tag)
                 msg.channel.send(Muted)
                setTimeout(() => {
                    mention.roles.remove(config.idMuted)
                    const isMuted = new Discord.MessageEmbed()
                        .setTimestamp()
                        .setAuthor(msg.author.tag, msg.author.avatarURL())
                        .setTitle('Fini !')
                        .setDescription(mention.displayName + ', tu peux à présent parler ! Ne recommence plus.')
                        .setColor(" #b9770e ")
                        .setFooter(msg.author.tag)
                    msg.channel.send(isMuted)
                }, args[2] * 1000);
            };
        };
    };
    if (msg.content.startsWith(config.playPrefix + config.cmdPlay) || msg.content.startsWith(config.playPrefix + "p")) {
        if(msg.member.voice.channel){
            let args = msg.content.split(" ");

            if (args[1] === undefined || !args[1].startsWith("https://www.youtube.com/watch?v=")){
                const errorEmbed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setColor("#C70039")
                    .setAuthor(msg.author.tag, msg.author.avatarURL())
                    .setTitle('Erreur !')
                    .setDescription("Le lien de la vidéo/musque a été non/mal inscrit")
                    .setFooter(msg.author.tag)
                
                msg.channel.send(errorEmbed)
                msg.delete()
            }
            else {
                if (list.length > 0){
                    list.push(args[1]);
                    const addEmbed = new Discord.MessageEmbed()
                        .setTimestamp()
                        .setColor("#00c109")
                        .setAuthor(msg.author.tag, msg.author.avatarURL())
                        .setTitle('Validé!')
                        .setDescription("La musique/vidéo a été ajoute avec succès à la liste d'attente !")
                        .setFooter(msg.author.tag)
                
                    msg.channel.send(addEmbed)
                    msg.delete()
                }
                else {
                    list.push(args[1]);
                    const addlistEmbed = new Discord.MessageEmbed()
                        .setTimestamp()
                        .setColor("#00c109")
                        .setAuthor(msg.author.tag, msg.author.avatarURL())
                        .setTitle('Validé!')
                        .setDescription("La musique/vidéo a été ajoute avec succès à la liste d'attente !")
                        .setFooter(msg.author.tag)
                
                    msg.channel.send(addlistEmbed)
                    msg.delete()

                    msg.member.voice.channel.join().then(connection => {
                        playMusic(connection);

                        connection.on("disconnect", () => {
                            list = [];
                        });
                    }).catch( err => {
                        msg.reply("Erreur connection " + err)
                    })
                }
            }
        }      
    };
    if (msg.content.startsWith(config.playPrefix + config.cmdList)) {
        let send = "**FILE D'ATTENTE**\n"
        for(var i = 0; i < list.length;i++){
            let name;
            await yt.getInfo(list[i], (err, info) => {
                if (err) {
                    console.log("Erreur de lien : " + err);
                    list.splice(i, 1);
                }
                else {
                    name = list[0].title
                }
            })
            send += "> " + i + " - " + name + "\n"; 
        }
        msg.channel.send(send)
    }
    if (msg.content.startsWith(config.playPrefix + config.cmdSkip)) {
        msg.member.voice.channel.join().then(connection => {
            list.shift();
            playMusic(connection);
        })
    }
    if (msg.content.startsWith(config.playPrefix + config.cmdLeave)) {
        msg.member.voice.channel.join().then(connection => {
            connection.disconnect();
        })
    }
    if (msg.content.startsWith(config.prefix + config.cmdReact) && msg.channel === client.channels.cache.get(config.channelStaff)) {
        const reactEmbed = new Discord.MessageEmbed() 
            .setTimestamp()
            .setColor( '#f0a300' )
            .setAuthor('Le règne shinobi', "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F268316090273141274%2F&psig=AOvVaw0_c3W1rcqzLCGgTXAyrLHL&ust=1626540187992000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCKjnusKE6PECFQAAAAAdAAAAABAD")
            .setTitle('Nouveauté ! Les roles notifications !')
            .setDescription("Nous avons rajouté un système de notification afin d'éviter de ping l'entièreté du serveur ! Pendant un petit moment, nous resterons comme d'habitude mais petit à petit nous nous dirigerons vers ce système !\n \n ⚙️ = Notification changelog \n  👓 = Notification Stream")
            .setFooter('Le règne shinobi')
        client.channels.cache.get(config.channelNotifs).send(reactEmbed).then(embedMessage => {
            embedMessage.react('⚙️')
            embedMessage.react('👓')
            msg.delete();
        });
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return;

    const reactRoleElem = config.reactionRole[reaction.message.id]
    if (!reactRoleElem) return;
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])

    if (emoji) reaction.message.guild.member(user).roles.add(emoji.roles)
    else reaction.users.remove(user)
})

client.on('messageReactionRemove', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return;

    const reactRoleElem = config.reactionRole[reaction.message.id]
    if (!reactRoleElem || !reactRoleElem.removable) return;
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])

    if (emoji) reaction.message.guild.member(user).roles.remove(emoji.roles)
})

function playMusic(connection){
    let dispatcher = connection.play(yt(list[0], { quality: "highestaudio",  highWaterMark: 1 << 25 }))

    dispatcher.on("finish", () => {
        list.shift();
        dispatcher.destroy();

        if (list.length > 0){
            playMusic(connection)
        }
        else {
            connection.disconnect();
        }
    });

    dispatcher.on("error", err => {
        console.log('Erreur dispatcher : ' + err)
        dispatcher.destroy();
        connection.disconnect();
    })
}