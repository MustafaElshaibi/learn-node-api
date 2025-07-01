const jwt = require('jsonwebtoken');

const generateAccessToken = (payload)=> {
  if(!payload || typeof payload !== 'object') {
    console.log('Invalid payload for token generation');
    return null;
  }

  const token =  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'});
  return token;
}

const generateRefreshToken = (payload)=> {
  if(!payload || typeof payload !== 'object') {
    console.log('Invalid payload for token generation');
    return null;
  }

  const token =  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
  return token;
}

module.exports =  {
  generateAccessToken,
  generateRefreshToken
}