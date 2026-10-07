const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  register,
  login
} = require('../controllers/authController');


// Normal Register
router.post('/register', register);


// Normal Login
router.post('/login', login);


// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);


// Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://ai-mock-test-beta.vercel.app/login'
  }),
  (req, res) => {

    const token = jwt.sign(
      {
        userId: req.user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    const user = {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email
    };

    res.redirect(
      `https://ai-mock-test-beta.vercel.app/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  }
);


module.exports = router;