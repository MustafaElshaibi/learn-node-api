const errorWrapper = require("../middlewares/errorWrapper.middleware");
const Users = require('../models/user.model');
const errorHelper = require("../utility/errorHelper");
const httpStatusText = require('../utility/httpStatusText');
const bcrypt = require('bcrypt');
const generateToken = require('../utility/generateToken');
const fs = require('fs');
const path = require('path');


const getAllUsers = errorWrapper(async(req, res) => {
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  const skip = (page - 1) * limit;
  const users = await Users.find({}, {__v: false, 'password': false}).limit(limit).skip(skip);
  res.status(200).json({status: httpStatusText.SUCCESS, data: {users: users}});
});

const register = errorWrapper(async(req, res, next)=> {
  const { firstName, lastName, email, password, role} = req.body;
  const oldUser = await Users.findOne({email: email});
  if(oldUser) {
    const error = errorHelper.create('this email is already exists', 400, httpStatusText.ERROR);
   if(req.file) {
    fs.unlink(path.join(__dirname, '..' , 'uploads', req.file.filename), (error)=> {
      if(error) {
        return next(errorHelper.create('error while deleting file', 500, httpStatusText.ERROR));
      }
    });
   } 
    return next(error);
  }

  const hashedPass = await bcrypt.hash(String(password), 10);
  const newUser = new Users({
    firstName,
    lastName,
    email,
    role,
    password: hashedPass,
    avatar: req.file && req.file.filename,
  });

  const accessToken = generateToken.generateAccessToken({id: newUser._id, email: newUser.email, role: newUser.role});
  const refreshToken = generateToken.generateRefreshToken({id: newUser._id, email: newUser.email, role: newUser.role});
  newUser.refreshToken = refreshToken;

  

  await newUser.save();
  const data = {
    ...newUser.toObject(),
    accessToken
  }

  res.status(201).json({status: httpStatusText.SUCCESS, data: {user: data }, message: 'user created successfully'});
})

const login = errorWrapper(async(req, res, next)=> {
  const {email, password} = req.body;
  const oldUser = await Users.findOne({email});
  if(!oldUser) {
    const error = errorHelper.create("email doesn't exist", 404, httpStatusText.FAIL);
    return next(error);
  }

  const passwordMatch = await bcrypt.compare(String(password), oldUser.password);
  if(!passwordMatch) {
    const error = errorHelper.create('password is not correct', 400, httpStatusText.FAIL);
    return next(error);
  }
  const accessToken = generateToken.generateAccessToken({id: oldUser._id, email: oldUser.email, role: oldUser.role});
  const refreshToken = generateToken.generateRefreshToken({id: oldUser._id, email: oldUser.email, role: oldUser.role});
  const user = await Users.findByIdAndUpdate(oldUser._id , {$set: {refreshToken: refreshToken}}, {new: true});
  const data = {
    ...user.toObject(),
    accessToken
  }

  res.status(200).json({status: httpStatusText.SUCCESS, data: {user: data}, message: 'user logged in successfully'});
})

module.exports = {
  getAllUsers,
  register,
  login
}