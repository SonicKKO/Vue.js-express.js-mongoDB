const Chat = require('../models/chat');

module.exports = (io) => {
    io.on('connection', (socket) => {
      // console.log('подключился:', socket.id);
  
      // присоединение пользователя к комнате
      socket.on('joinRoom', ({ chatId }) => {
        // console.log(`Пользователь ${socket.id} присоединился к комнате ${chatId}`);
        socket.join(chatId);
      });
      
  
      // сообщения в комнату
      socket.on('sendMessage', async ({ chatId, message, senderId }) => {
        // console.log('Получено сообщение:', { chatId, message, senderId });
      
        try {
          const chat = await Chat.findById(chatId);
          if (chat) {
            chat.messages.push({ content: message, sender: senderId });
            const savedChat = await chat.save();
            
            // console.log('сохранено:', savedChat);
      
            io.to(chatId).emit('receiveMessage', { message, sender: senderId });
          } else {
            // console.error(`чат с ID ${chatId} не найден`);
            socket.emit('sendMessageError', 'чат не найден');
          }
        } catch (error) {
          // console.error( error);
          socket.emit('sendMessageError', 'ошибка сохранения');
        }
      });
      
    });
  };