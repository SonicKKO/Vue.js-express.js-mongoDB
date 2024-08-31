const jwt = require("jsonwebtoken");
const SECRET_KEY = 'monkeyFlip'; 

exports.refreshToken = async (req, res) => {
    try {
        const userId = req.user.id; // ID пользователя из проверенного токена

        if (!userId) {
            return res.status(401).json({ message: 'Не удалось аутентифицировать пользователя' });
        }

        // новый токен
        const newToken = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '24h' });

        // oбновтокен в cookie
        res.cookie('token', newToken, { httpOnly: true });

        res.json({ token: newToken });
    } catch (error) {
        console.log(error);
        res.status(500).send('Ошибка при обновлении токена');
    }
};
