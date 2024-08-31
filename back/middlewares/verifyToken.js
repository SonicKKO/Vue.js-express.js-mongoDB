const jwt = require('jsonwebtoken');

const SECRET_KEY = 'monkeyFlip';

function verifyToken(req, res, next) {
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

module.exports = verifyToken; 
