const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

const authMiddleware = require('../middleware/auth');
const UserModel = require('../models/User');

dotenv.config();
const router = express.Router();

// @route     GET /api/auth
// @desc      Get logged in user
// @access    Private
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const user = await UserModel.getUserById(userId);

  if (user.error) {
    return res.status(400).json({ errors: [{msg: exist.error}]});
  } else if (user.result.length === 0) {
    return res.status(401).json({ errors: [{msg: 'Invalid token or token has expired'}]});
  } else {
    return res.status(200).json({ errors: [], data: {msg: 'User authenticated', user: user.result[0] }});
  }  
});

// @route     POST /api/auth
// @desc      Login a user & get token
// @access    Public
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  const {email, password} = req.body;
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Check if user exists
  const userExist = await UserModel.getUserByEmail(email);
  if (userExist.error) {
    return res.status(400).json({ errors: [{msg: exist.error}]});
  }  else if (userExist.result[0] && userExist.result[0].status === 0) {
    return res.status(400).json({ errors: [{msg: 'Invalid login credentials!'}]});
  } else if (userExist.result[0]) {
    const isMatch = await bcrypt.compare(password, userExist.result[0].password);
    if (isMatch) {
      // Generate JWT Token
      const payload = {
            user: {
              id: userExist.result[0].id
            }
          };
      const token = await jwt.sign(
                        payload,
                        process.env.JWTSECRET,
                        { expiresIn: 3600000 });
      userExist.result[0].token = token;
      delete userExist.result[0].password;
      return res.status(200).json({ errors: [], data: {msg: 'Login successful', user: userExist.result[0] }});
    } else {
      return res.status(400).json({ errors: [{msg: 'Invalid login credentials!'}]});
    }      
  } else {
    return res.status(400).json({ errors: [{msg: 'Invalid login credentials!'}]});
  }
});

module.exports = router;