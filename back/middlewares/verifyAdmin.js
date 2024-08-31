

const verifyAdmin = ( req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).send('низа');

    try {
      const verified = jwt.verify(token, SECRET_KEY);
      if (verified.role !== 'admin') return res.status(403).send('динах');
      next();
    } catch {
      res.status(400).send('Неверный токен');
    }
  };

  export default  verifyAdmin ;