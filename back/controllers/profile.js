const path = require('path');
const fs = require('fs');

const User = require("../models/auth");

exports.findProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); 
      res.json(user);
    } catch (error) {
      res.status(500).send('чет слетело');
    }
  };

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    await User.findByIdAndUpdate(userId, { name });
   res.status(200).json({ message: 'Профиль обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  const file = req.file;
  const userId = req.body.userId;

  if (!file) {
    return res.status(400).send('няма файла');
  }

  if (!userId) {
    return res.status(400).send('ади бо');
  }

  const user = await User.findById(userId);
  if (user) {
    // удаление старой фотки
    if (user.profilePicture) {
      const oldProfilePicturePath = path.join(process.cwd(), user.profilePicture);
      if (fs.existsSync(oldProfilePicturePath)) {
        fs.unlinkSync(oldProfilePicturePath);
      }
    }

    user.profilePicture = file.path;
    await user.save();
    res.status(200).send({ filePath: file.path });
  } else {
    res.status(404).send('no chela');
  }
};
