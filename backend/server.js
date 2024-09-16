const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const cors = require('cors');
const Chat = require('./models/chat.model');

dotenv.config();

const app = express();

app.use(cors({ origin: ['http://localhost:5173'] }));

app.get('/', (req, res) => {
  res.json('API is running');
});

app.get('/api/chat', (req, res) => {
  res.json(chats);
});

app.get('/api/chat/:id', (req, res) => {
  const { id } = req.params;
  const singleChat = chats.find((chat) => chat._id === id);
  res.json(singleChat);
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
