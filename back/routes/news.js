const express = require("express");
const router = express.Router();
const cors = require("cors");

const newsController = require('../controllers/news.js')

router.get("/api/news", cors(), newsController.findAllNews);
router.get("/api/news/:id", cors(), newsController.findOneNews);
router.post('/api/add-news', newsController.addNews);
router.delete('/api/delete-news', newsController.deleteNews);

module.exports = router;
 