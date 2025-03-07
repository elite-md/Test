const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

let client;

// Route to initialize WhatsApp client and generate QR code
app.post('/init', (req, res) => {
    const { number } = req.body;

    // Initialize WhatsApp client
    client = new Client({
        authStrategy: new LocalAuth({ clientId: number }),
        puppeteer: { headless: true },
    });

    // Generate QR code
    client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            if (err) {
                console.error('Error generating QR code:', err);
                res.status(500).send('Error generating QR code');
            } else {
                res.json({ qr: url });
            }
        });
    });

    // Handle authentication
    client.on('authenticated', () => {
        console.log('Authenticated!');
    });

    // Handle ready event
    client.on('ready', () => {
        console.log('Client is ready!');

        // Send the creds.json file to the user's WhatsApp
        const credsPath = path.join(__dirname, '.wwebjs_auth', `session-${number}`, 'creds.json');
        if (fs.existsSync(credsPath)) {
            const creds = fs.readFileSync(credsPath);
            client.sendMessage(`${number}@c.us`, {
                media: Buffer.from(creds),
                caption: 'Your creds.json file',
                filename: 'creds.json',
            }).then(() => {
                console.log('creds.json sent successfully!');
            }).catch((err) => {
                console.error('Error sending creds.json:', err);
            });
        } else {
            console.error('creds.json file not found!');
        }
    });

    // Initialize the client
    client.initialize();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
