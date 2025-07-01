const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const roles = require('../utility/roles');
const uploade = require('../utility/uploadFiles');


router.route('/')
  .get(verifyToken, allowedTo(roles.ADMIN, roles.MANAGER), userController.getAllUsers)

router.route('/register')
  .post(uploade.single('avatar'),userController.register)

router.route('/login')
  .post(userController.login)


  module.exports  = router;