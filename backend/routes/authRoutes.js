// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// GET /signup
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// POST /signup
router.post('/signup', authController.createUser);

// GET /login
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// POST /login
router.post('/login', authController.loginUser);

// GET /logout
router.get('/logout', authController.logoutUser);

module.exports = router;