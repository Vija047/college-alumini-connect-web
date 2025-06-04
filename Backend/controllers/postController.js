const Post = require('../model/Post');

exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, author: req.user.id });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Post creation failed' });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name batch');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};
