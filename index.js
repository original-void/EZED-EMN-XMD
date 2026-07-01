const express = require("express");
const QRCode = require("qrcode");
const pino = require("pino");
const { Boom } = require("@hapi/boom");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const app = express();

let qrImage = null;
let status = "Starting...";
let sock;

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>EZED EMN XMD</title>

        <style>
            body{
                background:#111;
                color:white;
                font-family:Arial;
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
                margin:0;
            }

            .card{
                background:#222;
                padding:30px;
                border-radius:15px;
                text-align:center;
                width:400px;
            }

            img{
                width:280px;
                margin-top:15px;
                border-radius:10px;
            }

            h1{
                color:#00ff88;
            }
        </style>
    </head>

    <body>

        <div class="card">

            <h1>EZED EMN XMD</h1>

            <h3>Status: ${status}</h3>

            ${
                qrImage
                    ? `<img src="${qrImage}" />`
                    : "<p>No QR Code</p>"
            }

        </div>

    </body>

    </html>
    `);
});

async function startBot() {

    const { state, saveCreds } =
        await useMultiFileAuthState("./session");

    const { version } =
        await fetchLatestBaileysVersion();

    sock = makeWASocket({
        auth: state,
        version,
        logger: pino({ level: "silent" }),
        browser: ["EZED EMN XMD", "Chrome", "1.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    // Load message events
    require("./events/messages")(sock);

    sock.ev.on("connection.update", async (update) => {

        const {
            connection,
            qr,
            lastDisconnect
        } = update;

        if (qr) {

            qrImage = await QRCode.toDataURL(qr);
            status = "Scan QR Code";

            console.log("Scan the QR Code");
        }

        if (connection === "open") {

            qrImage = null;
            status = "Connected";

            console.log("✅ Bot Connected");
        }

        if (connection === "close") {

            status = "Disconnected";

            const shouldReconnect =
                lastDisconnect?.error instanceof Boom
                    ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                    : true;

            console.log("Connection Closed");

            if (shouldReconnect) {
                console.log("Reconnecting...");
                startBot();
            } else {
                console.log("Logged Out");
            }

        }

    });

}

startBot();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Dashboard running on http://localhost:${PORT}`);

});
