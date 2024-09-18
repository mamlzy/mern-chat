const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/user.route');
const chatRoutes = require('./routes/chat.route');
const messageRoutes = require('./routes/message.route');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors({ origin: ['http://localhost:5173'] }));

app.get('/', (req, res) => {
  res.json('API is running');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8888;
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', (socket) => {
  console.log('(server) connected to socket.io', socket.id);

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log('(server) setup joined room:', userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', async (room) => {
    socket.join(room);
    const rooms = await io.fetchSockets();
    console.log('ROOMS =>', rooms.length);
    console.log('(server) User joined room: ' + room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users is not defined');

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
