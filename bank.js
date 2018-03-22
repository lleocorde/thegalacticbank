  //  Load SQLITE for the bank
const sql = require('sqlite');
sql.open('./bank.sqlite');

  //  Available Admin commands
module.exports.tgbAdmin = ['init','wipe'];

  //  Admin tools
module.exports.tgbSetup = function(msg, comm) {
  switch (comm) {
      //  Command to start up (install) the bank.
    case 'init':
        //  Initialize the artifact bank
      sql.get("SELECT * FROM artBank").then(row => {
        if (!row) {
          msg.channel.send('The Galactic Bank was already initialized but has not been used as yet.');
        } else {
          msg.channel.send('The Galactic Bank was already initialized.');
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS artBank (userId TEXT, type TEXT, level INTEGER, quantity INTEGER)").then(() => {
          msg.channel.send('The Galactic Bank has been initalized.');
        });
      });
      
        //  Initialize the member list
      sql.get("SELECT * FROM members").then(row => {
        if (!row) {
          msg.channel.send('Member list is active but nobody has signed up as yet.');
        } else {
          msg.channel.send('Member list is active and populated.');
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS members (userId TEXT, level INTEGER)").then(() => {
          msg.channel.send('Ready for members.');
        });
      });

      /*sql.run("CREATE TABLE IF NOT EXISTS members (userId TEXT, level INTEGER)").then(() => {
        msg.channel.send('Ready for Members.');
      }).catch(() => {
        msg.channel.send('Member list active.');
      });*/
      return msg.channel.send('Use \`!bank help\` to call the help file.');
      break;

      //  Command to delete everything before starting over
    case 'wipe':
      sql.run("DROP TABLE members");
      sql.run("DROP TABLE artBank");
      return msg.channel.send('The bank has been completely reset.');
      break;
  }
}

  //  Available commands for the bank
var commands = ['join','bal','pub','help','clr'
                ,'+','-','quit'
               ];
var deps = ['tet','blu','orb'];

var helpFile = {embed: {  //'There is nothing in the help file... yet...';
  color: 3447003,
  author: {
    name: 'The Galactic Bank'
  },
  title: '*Help File*',
  description: 'Interact with TGB using \`!bank [comm]\` where **[comm]** is one of the commands listed below.',
  fields: [
    {
      name: '__Admin Commands__',
      value: '\`init\` : Initilaizes the bank. Use this when you first install TGB!\r\n'
        +'\`wipe\` : Completely erases and uninstalls TGB.\r\n'
    },
    {
      name: '__Member Commands__',
      value: '\`join\` : Open a new account with TGB. Members must do this first before they can interact with TGB.\r\n'
        +'\`bal\`  : Have your current holdings sent to you in a private message.\r\n'
        +'\`pub\`  : The TGB will post your holdings to the current channel for all to see.\r\n'
        +'\`clr\`  : Clear out your holdings. (Useful if you need to start over.)\r\n'
        +'\`quit\` : Un-enroll from the bank.\r\n'
    },
    {
      name: '__Updating Your Ledger__',
      value: 'Use \`!bank [+/-] [type] [level] [quantity]\` to deposit or remove items from your account.'
        +'Allowable *types* are **tet**, **orb**, and **blu**.\r\n\r\n__Examples:__\r\n'
        +'\`!bank + tet 3 2\` adds 2 level 3 tetrahedrons\r\n'
        +'\`!bank - orb 1 4\` removes 4 level 1 orbs\r\n'

    },
    {
      name: '__Other Info__',
      value: 'Use \`!bank help\` to call this help file again. (An admin might\'ve already pinned it to this channel!)\r\n'
    }
  ],
  footer: {
    text: 'Thanks for using Hal! (by Lleocorde)'
  }
}
               };

  //  Main banking command handler for members
module.exports.bank = function(msg, comm, type, lvl, qty) {
var deliver = ''
if(comm == null) {
  msg.channel.send('You used \`!bank\` without any commands. Try \`!bank help\` to get started.');
  return;
}

    //  If it's not in the list of commands, send error message
  if(!commands.includes(comm.toLowerCase())) {
      return msg.channel.send('The Galactic Bank does not recognize the command \'*'+comm+'*\'...\r\n\r\nTry \`!bank help\` for instructions.');
    } else {

      //  If it IS in the list of comands, switch on it
      switch (comm.toLowerCase()) {
        case 'help':
          return msg.channel.send(helpFile);
          break;
        case '+':
          var plr = (qty>1) ? 's' : ''
          sql.get(`SELECT * FROM members WHERE userId ="${msg.author.id}"`).then(row => {
            if(!row) {
              msg.channel.send('You don\'t seem to have an account with The Galactic Bank.'+
                                 ' Use \`!bank join\` to join us and deposit your items!').then(msg => {
                msg.delete(10000)
              });
            } else {
              sql.run("INSERT INTO artBank (userId, type, level, quantity) VALUES (?, ?, ?, ?)", [msg.author.id, type, lvl, qty]).then(() => {
                msg.channel.send('Successfully added level '+lvl+' '+type+plr+' (quantity: '+qty+').').delete(10000);
              })
            }
          }).catch(() => {
                msg.channel.send('Please wait for an Admin to initalize the bank.');
              });
          break;
        case '-':
          var plr = (qty>1) ? 's' : ''
          sql.get(`SELECT * FROM members WHERE userId ="${msg.author.id}"`).then(row => {
            if(!row) {
              msg.channel.send('You don\'t seem to have an account with The Galactic Bank.'+
                                 ' Use \`!bank join\` to join us and deposit your items!').then(msg => {
                msg.delete(10000)
              });
            } else {
              sql.get(`SELECT * FROM artBank WHERE userID ="${msg.author.id}" AND type ="${type}" AND level =${lvl}`).then(row => {
                if(!row) {
                  msg.reply('you don\`t seem to have level '+lvl+' '+type+'s in your account.');
                } else {
                  msg.channel.send('This command is still in development. You\'ll be able to remove items eventualy.');
                }
              })
            }
          }).catch(() => {
                msg.channel.send('Please wait for an Admin to initalize the bank.');
              });
          break;

          /*
        case '-':
          return msg.channel.send('Sub '+type+' lvl: '+lvl+' qty: '+qty).then(msg => {
            msg.delete(10000)
          });
          break;
*/
        case 'join':
          sql.get(`SELECT * FROM members WHERE userId ="${msg.author.id}"`).then(row => {
            if(!row) {
              sql.run("INSERT INTO members (userId, level) VALUES (?, ?)", [msg.author.id, 1]).then(() => {
                msg.reply('you have been enrolled as a member in __The Galactic Bank__. Use \`!bank help\` to learn about commands.').delete(10000);
              })
            } else {
                msg.channel.send(msg.author.username+', you already have an account with __The Galactic Bank__.');
            }
          }).catch(() => {
              msg.channel.send('Please wait for an Admin to initalize the bank.');
            });
          break;
        case 'bal':
          sql.get(`SELECT * FROM members WHERE userId ="${msg.author.id}"`).then(row => {
            if(!row) {
              msg.channel.send('You don\'t seem to have an account with The Galactic Bank.'+
                                 ' Use \`!bank join\` to join us and deposit your items!').then(msg => {msg.delete(10000)});
          } else {
            //  Gather full list of cache for member
            sql.all(`SELECT type, level, sum(quantity) as total FROM artBank WHERE userId ="${msg.author.id}" GROUP BY type, level ORDER BY level, type`).then(rows => {
                //  If there's nothing there, error message.
              if (!rows) return msg.reply('You have nothing in your account! Use \`!bank help\` to learn commands and make your first deposit.');
                //  Response in-channel that balance will be sent via DM
              msg.channel.send(msg.author.username+', your ledger is being sent to you privately.').then(msg => {msg.delete(10000)});
                //  Generate leger message
              var gBalance = 'Your holdings with __The Galactic Bank__:\r\n\`\`\`\r\n'
              gBalance = gBalance
                        +'type | lvl | qty \r\n'
                        +'-----+-----+-----\r\n'
              var rpt = 0
              rows.forEach(function (row) {
                //gBalance = gBalance+`type ${row.type} level ${row.level} total: ${row.total}\r\n`;
                gBalance = gBalance+` ${row.type} | ${row.level} ${' '.repeat(3-row.level.toString().length)}| ${row.total}\r\n`;
              })
              gBalance = gBalance+'\`\`\`'
            msg.author.sendMessage(gBalance);
            });
          };
          }).catch(() => {
              msg.channel.send('Please wait for an Admin to initalize the bank.');
            });
          break;
        default:
          return msg.channel.send('The command **'+comm+'** is not ready... yet...');
          break;
      };

    }
  //msg.delete(10000);
}
