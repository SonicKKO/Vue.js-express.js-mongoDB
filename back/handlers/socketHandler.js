const Comment = require('../models/comment');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // console.log('Новый пользователь подключился');

    // сообщение от клиента
    socket.on('new_comment', async (comment) => {
      try {
        // cохранениy коммента в бд
        const newComment = new Comment({
          text: comment.text,
          userId: comment.userId,
          newsId: comment.newsId,
          userName: comment.userName, 
        });
        await newComment.save();

        // console.log('Новый комментарий сохранен:', newComment);

        // рассылка сообщения всем подключенным пользователям
        io.emit('new_comment', newComment);
      } catch (error) {
        console.error('Ошибка при сохранении комментария:', error);
      }
    });
    
    // отключение пользователя
    socket.on('disconnect', () => {
      // console.log('Пользователь отключился');
    });
  });
};

