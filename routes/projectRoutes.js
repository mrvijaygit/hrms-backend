const express = require('express');
const projectController = require('../controllers/projectController');
const router = express.Router();

router.get('/clients', projectController.clients);
router.post('/saveClient', projectController.saveClient);
router.get('/viewClient', projectController.viewClient);

router.get('/projects', projectController.projects);
router.post('/saveProject', projectController.saveProject);
router.get('/viewProject', projectController.viewProject);

router.get('/projectDetails', projectController.projectDetails);
router.post('/saveTeamMember', projectController.saveTeamMember);

module.exports = router;