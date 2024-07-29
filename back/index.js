  const express = require("express");
  const app = express();
  const cors = require("cors");
  const multer = require('multer');
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  const morgan = require("morgan");
  const bcrypt = require('bcrypt');
  const cookieParser = require('cookie-parser');
  const jwt = require("jsonwebtoken");
  const fs = require('fs');
  const path = require('path');
  const SECRET_KEY = 'monkeyFlip';

  const News = require("./models/news");
  const User = require("./models/auth");

  dotenv.config();
  console.log("MongoDB URL:", process.env.MONGO_URL);

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use('/uploads', express.static('uploads'));

  // подключение к БД через mongoose
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("БД воркает");
    })
    .catch((error) => {
      console.log("Бобик БД не гавкает", error);
    });

  // создание роутов
  app.get("/", (req, res) => {
    res.send("Soken backend server");
  });

  app.get("/api/news", cors(), async (req, res, next) => {
    const allnews = await News.find({});
    res.send(allnews);
  });

  app.get("/api/news/:id", cors(), async (req, res) => {
    let id = req.params.id.toString(); 
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidObjectId) {
      return res.status(400).json({ message: "формать не" });
    }

    const onenews = await News.findById(id)
      .then((onenews) => {
        if (!onenews) {
          return res.status(404).json({ message: "пусто вроде" });
        }
        res.json(onenews);
      })
      .catch((err) => res.status(500).json({ message: "бооооо сервер" }));
  });

  app.post("/api/register", cors(), async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      const userExists = await User.findOne({ $or: [{ name }, { email }] });
      if (userExists) { 
        if (userExists.email === req.body.email) {
          return res.status(400).json({ message: 'почта занята бо '});
        } else if (userExists.name === req.body.name) {
          return res.status(400).json({ message: 'имя занято бо' });
        }        
      }

      await newUser.save();
      res.status(201).send("зареган");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'просто лошара анлак' });
    }
  });

  app.get("/api/register", cors(), async (req, res, next) => {
    const allUsers = await User.find({});
    res.send(allUsers);
  });

  app.post("/api/login", cors(), async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Не та почта" });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "факе пассворд" });
      }

      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "24h" });
      res.cookie('token', token, { httpOnly: true });
      res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).send("чет по пиздяке пошло");
    }
  });

  app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); 
      res.json(user);
    } catch (error) {
      res.status(500).send('чет слетело');
    }
  });

  function authMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).send('Траблы с токеном');
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send('токен бобо');
    }
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage });

  app.post('/upload', upload.single('file'), async (req, res) => {
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
      // Delete old profile picture if it exists
      if (user.profilePicture) {
        const oldProfilePicturePath = path.join(__dirname, user.profilePicture);
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
  });

  app.delete('/api/deleteAccount', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (user.profilePicture) {
        const oldProfilePicturePath = path.join(__dirname, user.profilePicture);
        if (fs.existsSync(oldProfilePicturePath)) {
          fs.unlinkSync(oldProfilePicturePath);
        }
      }
  
      await User.findByIdAndDelete(userId);
      res.status(200).send('Аккаунт удален');
    } catch (error) {
      console.error('Ошибка при удалении аккаунта:', error);
      res.status(500).send('Не удалось удалить аккаунт');
    }
  });
  

  app.use(morgan("common"));
  app.listen(5137, () => {
    console.log("Бэк сервер ворк на http://localhost:5137");
  });