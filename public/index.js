<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WhatsApp Bot Creds Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
            background-color: #f0f2f5;
        }
        h1 {
            margin-bottom: 20px;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        input {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            padding: 10px;
            font-size: 16px;
            background-color: #25d366;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #128c7e;
        }
        #qrCode {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>WhatsApp Bot Creds Generator</h1>
    <form id="numberForm">
        <label for="number">Enter your WhatsApp number (with country code):</label>
        <input type="text" id="number" name="number" required placeholder="e.g., 1234567890">
        <button type="submit">Get Pairing Code</button>
    </form>
    <div id="qrCode"></div>

    <script>
        document.getElementById('numberForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const number = document.getElementById('number').value;

            const response = await fetch('/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number }),
            });

            const data = await response.json();
            if (data.qr) {
                document.getElementById('qrCode').innerHTML = `<img src="${data.qr}" alt="QR Code">`;
            }
        });
    </script>
</body>
</html>
