const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

function connectDB() {
  mongoose
    .connect( process.env.MONGO_URL )
    .then(() => {
      console.log("БД воркает");
      console.log("MongoDB URL:", process.env.MONGO_URL);
    })
    .catch((error) => {
      console.error("Бобик БД не гавкает", error);
    });
}

module.exports = connectDB;
