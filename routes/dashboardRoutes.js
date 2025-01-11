const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const router = express.Router();

// Define routes
router.get('/getAll', dashboardController.getAll);

module.exports = router;