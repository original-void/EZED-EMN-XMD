const commandHandler = require("../lib/commandHandler");

module.exports = (sock) => {

    sock.ev.on("messages.upsert", async ({ messages, type }) => {

        if (type !== "notify") return;

        const msg = messages[0];

        if (!msg.message) return;

        if (msg.key.fromMe) return;

        await commandHandler(sock, msg);

    });

};
