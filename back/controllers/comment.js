const Comment = require('../models/comment');

exports.getAllComments = async (req, res) => {
    try {
      const newsId = req.params.newsId;
      const comments = await Comment.find({ newsId }).sort({ createdAt: -1 });
      res.json(comments);
    } catch (error) {
      console.error('без комов:', error);
      res.status(500).send('сервре бо');
    }
  };
