const ms = require('ms');

exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Mesajları Yönetme Yetkisine Sahip Olmasılısın!');
    }

    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.channel.send(':x: Geçerli bir kanaldan bahsetmelisin!');
    }

    // Giveaway duration
    let giveawayDuration = args[1];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: Geçerli bir süre belirtmelisin!');
    }

    // Number of winners
    let giveawayNumberWinners = args[2];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send(':x: Geçerli sayıda kazanan belirtmelisin!');
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(':x: Geçerli bir ödül belirtmelisin!');
    }

    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: giveawayNumberWinners,
        // Who hosts this giveaway
        hostedBy: client.config.hostedBy ? message.author : null,
        // Messages
        messages: {
            giveaway: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **ÇEKİLİŞ BAŞLADI** 🎉🎉 @everyone",
            giveawayEnded: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **ÇEKİLİŞ BİTTİ** 🎉🎉 @everyone",
            timeRemaining: "<a:cekilis:749632799371165757> Kalan Süre: **{duration}**!",
            inviteToParticipate: "Katılmak için 🎉 ile tepkisine basın!",
            winMessage: "🎉Tebrikler, {winners}! Sen Kazandın!🎉",
            embedFooter: "Çekiliş",
            noWinner: "Çekiliş iptal edildi, katılım yok",
            hostedBy: "Sponsor: {user}",
            winners: "winner(s)",
            endedAt: "Bitiş Tarihi",
            units: {
                seconds: "Saniye",
                minutes: "Dakika",
                hours: "Saat",
                days: "Gün",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });

    message.channel.send(`Çekiliş Başladı! ${giveawayChannel}!`);

};