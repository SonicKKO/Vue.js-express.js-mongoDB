const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment.js')

router.get('/comments/:newsId', commentController.getAllComments);

module.exports = router;
