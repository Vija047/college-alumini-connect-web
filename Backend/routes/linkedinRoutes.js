const express = require('express');
const router = express.Router();
const linkedinController = require('../controllers/linkedinController');
const auth = require('../middleware/authmiddleware');
router.put('/url', auth, linkedinController.syncLinkedIn);

module.exports = router;
