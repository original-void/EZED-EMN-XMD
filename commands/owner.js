const config = require("../config");

module.exports = {

    name: "owner",

    async execute(sock, msg) {

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`👤 Owner

Name: ${config.OWNER_NAME}

Number: ${config.OWNER_NUMBER}`
            }
        );

    }

};
