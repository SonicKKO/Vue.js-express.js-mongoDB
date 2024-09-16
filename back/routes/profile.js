const express = require("express");
const router = express.Router();
const multer = require('multer');

const User = require("../models/auth");

const profileController = require('../controllers/profile.js')
const verifyToken = require("../middlewares/verifyToken.js");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

const upload = multer({ storage });

router.get('/api/profile', verifyToken,  profileController.findProfile);
router.put('/api/update-profile', verifyToken, profileController.updateProfile);
router.post('/upload', upload.single('file'), profileController.uploadProfilePicture);

router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}); 
    res.json(users);
  } catch (error) {
    res.status(500).send('чет слетело');
  }
});

router.get('/api/users/:userId', async (req, res) => {
  let id = req.params.userId; 
  console.log( id )

  try {
      const user = await User.findById(id);
      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка на сервере" });
  }
});

module.exports = router; 
