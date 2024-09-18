const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({ message: 'Please enter all the fields' });
  }

  try {
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    res.status(201).json(message);
  } catch (err) {
    console.log('err => ', err);
    res.status(400);
    throw new Error(err.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name pic email')
      .populate('chat');

    res.status(200).json(messages);
  } catch (err) {
    console.log('err => ', err);
    res.status(400);
    throw new Error(err.message);
  }
});

module.exports = { sendMessage, allMessages };
