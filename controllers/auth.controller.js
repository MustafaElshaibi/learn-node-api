const errorHelper = require('../utility/errorHelper');
const errorWrapper = require('../middlewares/errorWrapper.middleware');
const httpStatus = require('../utility/httpStatusText');
const User = require('../models/user.model');
const { generateAccessToken } = require('../utility/generateToken');
const jwt = require('jsonwebtoken');


const getAccessTokenFromRefreshToken = errorWrapper(async (req, res, next)=> {
    const { refreshToken} = req.body;
    if (!refreshToken ) {
      return next(errorHelper.create('Refresh token is required', 400, httpStatus.FAIL));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        if(error.name === "TokenExpiredError") {
          return next(errorHelper.create('Refresh token expired', 401, httpStatus.FAIL));
        }
        return next(errorHelper.create('Invalid refresh token', 401, httpStatus.FAIL));
      }
      return decoded;
    })
    if(!decoded) return;
    const user = await User.findOne({ _id: decoded.id, refreshToken: refreshToken });
    if (!user) {
      return next(errorHelper.create('User not found or refresh token is invalid', 404, httpStatus.FAIL));
    }

    const accessToken = generateAccessToken({id: user._id, email: user.email, role: user.role });

    if (!accessToken) {
      return next(errorHelper.create('Failed to generate access token', 500, httpStatus.FAIL));
    }

    res.status(200).json({status: httpStatus.SUCCESS, message: 'Access token generated successfully', data: accessToken });
  });

  module.exports = {
    getAccessTokenFromRefreshToken
  }