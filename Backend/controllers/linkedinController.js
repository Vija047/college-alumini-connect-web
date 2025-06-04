const User = require('../model/users'); // <-- Import the model

exports.syncLinkedIn = async (req, res) => {
  try {
    const { linkedinUrl } = req.body;

    const user = await User.findById(req.user.id); // req.user is populated by auth middleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.linkedin = linkedinUrl;
    await user.save();

    res.status(200).json({ message: 'LinkedIn synced successfully' });
  } catch (error) {
    console.error('LinkedIn Sync Error:', error.message);
    res.status(500).json({ message: 'Failed to sync LinkedIn' });
  }
};
