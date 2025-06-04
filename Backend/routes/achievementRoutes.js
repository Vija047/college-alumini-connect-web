const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const auth = require('../middleware/authmiddleware');

router.post('/add', auth, achievementController.addAchievement);

module.exports = router;
