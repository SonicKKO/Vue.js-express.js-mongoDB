const express = require("express");
const router = express.Router();
const multer = require('multer');

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

router.get('/api/profile', verifyToken, profileController.findProfile);
router.put('/api/update-profile', verifyToken, profileController.updateProfile);
router.post('/upload', upload.single('file'), profileController.uploadProfilePicture);

module.exports = router; 
