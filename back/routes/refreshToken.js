const express = require("express");
const router = express.Router();
const cors = require("cors");

const tokenController = require('../controllers/refreshToken')
const verifyToken = require("../middlewares/verifyToken");

router.post('/api/refresh-token', cors(), verifyToken, tokenController.refreshToken);

module.exports = router; 
