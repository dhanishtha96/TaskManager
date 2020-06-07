const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'stackhack_theme_1_task_manager');
    next();
  } catch(error) {
    res.status(401).json({message: 'Auth failed!'});
  }

};
