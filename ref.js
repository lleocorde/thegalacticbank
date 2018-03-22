  // Allowable commands
module.exports.commands = ['join','bal','dep','help'];

// When a user joins the bank
module.exports.bankJoin = (usr) => '__**'+usr+'** has joined The Galactic Bank__\r\n\r\n'
                             +'Please make your initial deposit using the \`!bank deposit\` command.\r\n'
                             +'\`\`\`\r\n'
                             +'Examples:\r\n'
                             +'!bank deposit [type] [level] [quantity]\r\n'
                             +'!bank deposit tet 2 3\r\n'
                             +'!bank deposit orb 4 2\r\n'
                             +'!bank deposit crystal 3 1\r\n'
                             +'\`\`\`';

  // When the !bank command is not recognized
module.exports.unkF = function(comm) {
  return 'The Galactic Bank does not recognize the command \'*'+comm+'*\'... yet. Try \`!bank help\` for instructions.';
}

  // When !bank is used with no argument
module.exports.bankNull = 'The Galactic Bank records the artifact cache of it\'s members and coordinates trade.\r\n\r\n'
                             +'*You are seeing this informational message because you used the \`!bank\` request without a specific command.'
                             +' Try \`!bank help\` for instructions.*';

  // When the help file is requested
module.exports.bankHelp = 'This help file is incomplete...';

  // When the admin wants to tear it all down...
module.exports.bankBomb = function(role,usr) {
  if(role) {
    return '**'+usr+'**, please confirm you want to wipe the bank completely. You have 10 seconds to respond or this action will be cancelled.';
  } else {
    return 'You do not have the correct role to use that command.';
  }
}
