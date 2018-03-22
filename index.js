const Discord = require('discord.js');
const bot = new Discord.Client();
const sql = require('sqlite');
sql.open('./score.sqlite');
const gb = "!bank";
const ref = require('./ref.js');
const alive = require('./alive.js');
const gbc = require('./bank.js');

bot.on('ready', () => {
    console.log('Ready!');
});

bot.on('message',(message) => {
  const comm = message.content.split(/ +/g);
  
  var isAdmin = message.member.roles.has(message.guild.roles.get(process.env.admin).id);
  
  if(message.author.bot) return; // Ignore bots.
  if(message.channel.type === "dm") {  // Ignore DM channels.
    message.channel.send('I\'m not setup for DMs yet...');
    return;
  }

  if(message.content.startsWith('!test')) {
    message.channel.send('\`\`\`\r\n'
                         +'\The Galactic Bank is online and responding.'
                         +'\r\nReceived message: \''
                         +comm.splice(1)+'\'\r\n'
                         +'\`\`\`'
                        );
    return;
  }
  
  if(comm[0]==gb) {
    if (isAdmin && gbc.tgbAdmin.includes(comm[1])) {
      gbc.tgbSetup(message,comm[1]);
    } else {
 //     message.delete();
      gbc.bank(message,comm[1],comm[2],comm[3],comm[4]);
    }
  }
});

bot.login(process.env.DISCORD_BOT_TOKEN);
