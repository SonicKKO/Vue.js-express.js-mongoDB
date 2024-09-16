const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  newsId: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  userName: { type: String },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
