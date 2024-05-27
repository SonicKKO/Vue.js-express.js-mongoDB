const express = require("express");
const app = express();
const cors = require("cors"); 

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const SECRET_KEY = 'monkeyFlip';

const NewsModel = require("./models/news");
const User = require("./models/auth");

dotenv.config();
console.log("MongoDB URL:", process.env.MONGO_URL);

app.use(express.json());


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

// отдельные роуты для каждой новости
app.get("/api/news/:id", cors(), async (req, res) => {
  let id = req.params.id.toString(); // Convert id to string
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidObjectId) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const onenews = await News.findById(id)
    .then((onenews) => {
      if (!onenews) {
        return res.status(404).json({ message: "News not found" });
      }
      res.json(onenews);
    })
    .catch((err) => res.status(500).json({ message: "Internal server error" }));
});

// регистрация
app.post("/api/register", cors(), async (req, res) => {
  try {
    console.log(req.body); 
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    const userExists = await User.findOne({ $or: [{ name: name }, { email: email }] });
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

//авторизация
app.post("/api/login", cors(), async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({email, password})
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Не та почта" });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "факе пассворд" });
    }
//выдача токена при авторизации
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "24h" });

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("чет по пиздяке пошло");
  }
});


app.use(cors({ origin: 'http://localhost:5173' }));
app.use(morgan("common"));
app.listen(5137, () => {
  console.log("Бэк сервер ворк на http://localhost:5137");
});
