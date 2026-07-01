const express = require("express");
const QRCode = require("qrcode");
const pino = require("pino");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const app = express();

let qrImage = null;
let status = "Starting...";

app.get("/", (req, res) => {
    res.send(`
    <html>
    <head>
        <title>EZED EMN XMD</title>
        <style>
            body{
                font-family:Arial;
                background:#111;
                color:#fff;
                text-align:center;
                padding-top:40px;
            }
            img{
                width:300px;
                border-radius:12px;
            }
            .card{
                max-width:420px;
                margin:auto;
                background:#222;
                padding:20px;
                border-radius:15px;
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
                    : "<p>No QR available.</p>"
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

    const sock = makeWASocket({
        auth: state,
        version,
        logger: pino({ level: "silent" }),
        browser: ["EZED EMN XMD","Chrome","1.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async(update)=>{

        const { connection, qr, lastDisconnect } = update;

        if(qr){
            qrImage = await QRCode.toDataURL(qr);
            status = "Scan QR Code";
        }

        if(connection==="open"){
            qrImage=null;
            status="Connected";
            console.log("Connected");
        }

        if(connection==="close"){

            status="Disconnected";

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if(shouldReconnect){
                startBot();
            }
        }

    });

}

startBot();

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Dashboard running on port",PORT);
});
