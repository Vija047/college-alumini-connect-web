const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/authmiddleware');

router.post('/send', auth, messageController.sendMessage);
router.get('/:userId', auth, messageController.getMessagesWithUser);

module.exports = router;
