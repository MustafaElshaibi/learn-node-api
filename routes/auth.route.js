const express = require('express');
const { getAccessTokenFromRefreshToken } = require('../controllers/auth.controller');
const router = express.Router();


router.route('/refresh-token')
  .post(getAccessTokenFromRefreshToken)

  module.exports  = router;