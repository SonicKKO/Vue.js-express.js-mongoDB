const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");

const Chat = require('../models/chat');
const SECRET_KEY = process.env.SECRET_KEY; 


//переход или создание чата
router.post('/api/chats', async (req, res) => {
  const { userId1,  userId2 } = req.body;
  // console.log('чат между:', userId1, userName1, 'и', userId2,  userName2 );

  try {
    let chat = await Chat.findOne({ participants: { $all: [userId1, userId2] } });

    if (!chat) {
      chat = new Chat({ participants: [userId1, userId2], messages: [] });
      await chat.save();
    }

    // console.log( chat._id);
    res.json({ chatId: chat._id });
  } catch (error) {
    console.error('oшибка создания чата:', error);
    res.status(500).json({ message: 'oшибка создания чата' });
  }
});

//список всех чатов
router.get('/api/chats', async (req, res) => {
  try {
      const Chats = await Chat.find({});
      res.send(Chats);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "ошибка при получении " });
  }
});

//получение чата
router.get('/api/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'бобо' });
  }
});

//получение сообщений
router.get('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    res.json({ messages: chat.messages });
  } catch (error) {
    res.status(500).send('Ошибка при загрузке сообщений');
  }
});

module.exports = router;
