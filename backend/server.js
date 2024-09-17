const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/user.route');
const chatRoutes = require('./routes/chat.route');
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

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8888;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
