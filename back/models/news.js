const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    id: String,
    title: String,
    imgUrl: String,
    text: String,
    date: String
}); 

News = mongoose.model('news', newsSchema);
module.exports = News;