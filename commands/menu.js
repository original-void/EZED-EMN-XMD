const config = require("../config");

module.exports = {
    name: "menu",

    async execute(sock, msg) {

        const menu = `
╭━━━〔 ${config.BOT_NAME} 〕━━━

👋 Welcome!

╭─ General
│ • .menu
│ • .ping
│ • .owner
╰────────────

╭─ Group
│ • .tagall
│ • .kick
│ • .add
│ • .promote
│ • .demote
╰────────────

╭─ AI
│ • .ai
│ • .chat
╰────────────

╭─ Fun
│ • .joke
│ • .quote
╰────────────

Version : ${config.VERSION}

${config.FOOTER}
`;

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: menu
            }
        );

    }
};
