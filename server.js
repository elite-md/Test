const express = require("express");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

let sock;
let credsPath = "./auth";

app.post("/pair", async (req, res) => {
    try {
        if (!req.body.phone) return res.status(400).json({ error: "Phone number is required" });

        // Setup authentication
        const { state, saveCreds } = await useMultiFileAuthState(credsPath);
        sock = makeWASocket({ auth: state });

        sock.ev.on("creds.update", saveCreds);
        sock.ev.on("connection.update", (update) => {
            const { qr, connection } = update;
            if (qr) {
                res.json({ pairingCode: qr });
            } else if (connection === "open") {
                console.log("WhatsApp linked successfully");
            }
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to generate pairing code" });
    }
});

app.get("/download", (req, res) => {
    const credsFile = `${credsPath}/creds.json`;
    if (fs.existsSync(credsFile)) {
        res.download(credsFile, "creds.json");
    } else {
        res.status(404).json({ error: "creds.json not found" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
