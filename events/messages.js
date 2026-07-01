module.exports = (sock) => {

    sock.ev.on("messages.upsert", async ({ messages }) => {

        console.log("EVENT FIRED");

        const msg = messages[0];

        console.log(JSON.stringify(msg, null, 2));

    });

};
