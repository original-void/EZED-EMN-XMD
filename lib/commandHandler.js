const fs = require("fs");
const path = require("path");
const config = require("../config");

const commands = new Map();

const commandPath = path.join(__dirname, "../commands");

// Load all command files
const commandFiles = fs.readdirSync(commandPath).filter(file =>
    file.endsWith(".js")
);

for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));

    if (command.name && command.execute) {
        commands.set(command.name.toLowerCase(), command);
        console.log(`Loaded command: ${command.name}`);
    }
}

module.exports = async (sock, msg) => {

    try {

        const text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text;

        if (!text) return;

        if (!text.startsWith(config.PREFIX)) return;

        const args = text
            .slice(config.PREFIX.length)
            .trim()
            .split(/\s+/);

        const commandName = args.shift().toLowerCase();

        const command = commands.get(commandName);

        if (!command) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Unknown command: ${commandName}\n\nType ${config.PREFIX}menu`
            });
        }

        await command.execute(sock, msg, args);

    } catch (err) {
        console.error(err);

        await sock.sendMessage(msg.key.remoteJid, {
            text: "❌ An error occurred while executing the command."
        });
    }

};
