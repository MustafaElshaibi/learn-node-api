const errorHelper = require("../utility/errorHelper");
const httpStatusText = require('../utility/httpStatusText');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if(!header) {
    const error = errorHelper.create('token is required', 401, httpStatusText.ERROR);
    return next(error);
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded
    next();
  }catch (error) {
    const err = errorHelper.create('token is expired', 401, httpStatusText.ERROR);
    return next(err);
  }
}

module.exports = verifyToken;