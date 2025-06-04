const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/useroutes');
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require('./routes/postRoutes');
const linkedinRoutes = require('./routes/linkedinRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 7000; // match frontend's fetch URL port
app.use(cors({
  origin: "https://alumini-connect-frontend.vercel.app/", // frontend Vite default
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/linkedin', linkedinRoutes);
app.use('/api/achievements', achievementRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Alumni Connect Portal Backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
