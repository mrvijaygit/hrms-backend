const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Define routes
router.post('/login', authController.login);
router.post('/token', authController.token);

module.exports = router;