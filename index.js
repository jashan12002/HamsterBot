const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse incoming requests
app.use(bodyParser.json());

// Route for Telegram Webhook
app.post('/telegram-webhook', (req, res) => {
  const message = req.body.message;

  // Handle Telegram messages here
  if (message.text === '/start') {
    
    res.send({
      method: 'sendMessage',
      chat_id: message.chat.id,
      text: 'Welcome to the Bot!',
    });
  } else {
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
