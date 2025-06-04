const User = require('../model/users');

// Get all verified alumni (Alumni Directory)
const getAllAlumni = async (req, res) => {
  try {
    const alumni = await User.find({ }).select('-password');
    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch alumni' });
  }
};

// Search & filter alumni
const searchAlumni = async (req, res) => {
  try {
    const { batch, branch, jobTitle, location } = req.query;
    const query = {};

    if (batch) query.graduationYear = batch; // Adjusted to match schema
    if (branch) query.branch = { $regex: branch, $options: 'i' };
    if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };

    const results = await User.find(query).select('-password');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
};

// Get current user's profile
const getMyProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing in request' });
    }

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('getMyProfile Error:', error.message);
    res.status(500).json({ message: 'Unable to fetch profile' });
  }
};

// Update current user's profile
const updateMyProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updated);
  } catch (error) {
    console.log(error)
;    res.status(500).json({ message: 'Profile update failed' });
  }
};

// Get specific alumni by ID
const getAlumniById = async (req, res) => {
  try {
    const alumni = await User.findById(req.params.id).select('-password');
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
    res.status(200).json(alumni);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export all controller functions
module.exports = {
  getAllAlumni,
  searchAlumni,
  getMyProfile,
  updateMyProfile,
  getAlumniById
};
