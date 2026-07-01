const commandHandler = require("../lib/commandHandler");

module.exports = (sock) => {

    sock.ev.on("messages.upsert", async ({ messages }) => {

        const msg = messages[0];

        console.log("New message received");

        if (!msg.message) return;

        if (msg.key.fromMe) return;

        console.log(JSON.stringify(msg, null, 2));

        await commandHandler(sock, msg);

    });

};
