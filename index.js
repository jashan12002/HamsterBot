const express = require('express');
const bodyParser = require('body-parser');
const qrcode = require('qrcode'); // QR code generator package

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse incoming requests
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Function to generate a QR code for the mobile link
function generateQRCode(url) {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(url, function (err, qrCodeUrl) {
      if (err) reject(err);
      resolve(qrCodeUrl);
    });
  });
}

// Route for Telegram Webhook
app.post('/telegram-webhook', async (req, res) => {
  const message = req.body.message;

  if (message.text === '/start') {
    // Define your mobile game URL
    const mobileGameUrl = 'http://localhost:3000/';

    // Send game link and QR code
    const qrCodeUrl = await generateQRCode(mobileGameUrl);

    // Respond with the welcome message and game link (or QR code)
    res.send({
      method: 'sendMessage',
      chat_id: message.chat.id,
      text: 'Welcome to the game! You can play on mobile using the following link:',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Play the Game', url: mobileGameUrl }
          ]
        ]
      }
    });
    
    // If the user is on a desktop, send a QR code to scan:
    if (message.from && message.from.is_bot === false) { // Simple check for non-bot users
      res.send({
        method: 'sendMessage',
      chat_id: message.chat.id,
      text: `Play on mobile phone`,
      });
    }

  } else {
    // Respond to other messages
    res.send({
      method: 'sendMessage',
      chat_id: message.chat.id,
      text: `You said: ${message.text}`,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
