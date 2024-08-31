const express = require("express");
const router = express.Router();

const authController = require('../controllers/auth');
const verifyToken = require('../middlewares/verifyToken');

router.post('/api/register', authController.register)
router.post("/api/login", authController.login);
router.delete('/api/deleteAccount', verifyToken, authController.deleteAccount);

module.exports = router;
