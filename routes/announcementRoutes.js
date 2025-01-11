const express = require('express');
const announcementController = require('../controllers/announcementController');
const router = express.Router();

router.get('/notice', announcementController.notice);
router.post('/saveNotice', announcementController.saveNotice);
router.get('/viewNotice', announcementController.viewNotice);

module.exports = router;