const User = require('../model/users');

exports.addAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const user = await User.findById(req.user.id);
    user.achievements.push({ title, description, date });
    await user.save();
    res.status(200).json(user.achievements);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Could not add achievement' });
  }
};
