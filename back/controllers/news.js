const mongoose = require("mongoose");

const News = require("../models/news");

exports.findAllNews =  async (req, res, next) => {
    try {
        const allnews = await News.find({});
        res.send(allnews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при получении новостей" });
    }
};

exports.findOneNews = async (req, res) => {
    let id = req.params.id.toString(); 
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidObjectId) {
        return res.status(400).json({ message: "Некорректный формат ID" });
    }

    try {
        const onenews = await News.findById(id);
        if (!onenews) {
            return res.status(404).json({ message: "Новость не найдена" });
        }
        res.json(onenews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка на сервере" });
    }
};

exports.addNews = async (req, res) => {
    try {
        const { title, text, imgUrl } = req.body;
        const newNews = new News({ title, text, imgUrl, date: new Date() });
        await newNews.save();
        res.status(201).json({ message: 'Новость добавлена', news: newNews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при добавлении новости' });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'ID новости не пришел' });
        }

        const result = await News.deleteOne({ _id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Новость не найдена' });
        }

        res.status(200).json({ message: 'Новость удалена' });
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        res.status(500).json({ message: 'Ошибка при удалении новости' });
    }
};
 