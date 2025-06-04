const express = require('express');
const router = express.Router();

const {
  getAllAlumni,
  searchAlumni,
  getMyProfile,
  updateMyProfile,
  getAlumniById
} = require('../controllers/usercontroller');

const authMiddleware = require('../middleware/authmiddleware');

// Public Routes
router.get('/directory', getAllAlumni);
router.get('/search', searchAlumni);
router.get('/profile',authMiddleware, getMyProfile);
router.put('/update-profile', authMiddleware, updateMyProfile);
router.get('/:id',getAlumniById);
// module.exports
module.exports = router;
