const Message = require('../model/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Message sending failed' });
  }
};

exports.getMessagesWithUser = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};
