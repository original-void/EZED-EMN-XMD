module.exports = (sock) => {
    sock.ev.on("messages.upsert", async (m) => {
        console.log("EVENT:", JSON.stringify(m, null, 2));
    });
};
