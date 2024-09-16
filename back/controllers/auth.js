const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcrypt");

const User = require("../models/auth"); 
const SECRET_KEY = process.env.SECRET_KEY; 

exports.register = async (req, res) => {
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
              return res.status(400).json({ message: 'почта занята бо ' });
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
};

exports.login = async (req, res) => {
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
  };

exports.deleteAccount =  async (req, res) => {
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
  };
