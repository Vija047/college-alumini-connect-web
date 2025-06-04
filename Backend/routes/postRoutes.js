const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/authmiddleware');

router.post('/create', auth, postController.createPost);
router.get('/allpost', postController.getAllPosts);

module.exports = router;
