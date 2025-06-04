# Alumni Connect Portal Backend

A RESTful API backend service for an Alumni Connect Portal that enables alumni networking, messaging, and profile management.

## Project Overview

The Alumni Connect Portal is a platform that allows alumni to:
- Create and manage profiles
- Connect with other alumni
- Share posts and achievements
- Send direct messages
- Search and filter alumni directory
- Sync LinkedIn profiles

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for emails
- Cloudinary for media storage

## Project Structure

```
├── config/
│   ├── cloudinary.js    # Cloudinary configuration
│   └── db.js           # MongoDB connection setup
├── controllers/
│   ├── achievementController.js
│   ├── authController.js
│   ├── linkedinController.js
│   ├── messageController.js
│   ├── postController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models/
│   ├── Achievement.js
│   ├── Message.js
│   ├── Post.js
│   ├── Token.js
│   └── users.js
├── routes/
│   ├── achievementRoutes.js
│   ├── authRoutes.js
│   ├── linkedinRoutes.js
│   ├── messageRoutes.js
│   ├── postRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── email.js
│   ├── helpers.js
│   └── logger.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── vercel.json
```

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=7000
MONGODB_URI=mongodb://127.0.0.1:27017/aluminiportal
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users/directory` - Get all alumni
- GET `/api/users/search` - Search alumni
- GET `/api/users/profile` - Get current user profile
- PUT `/api/users/update-profile` - Update user profile
- GET `/api/users/:id` - Get specific alumni

### Posts
- POST `/api/posts/create` - Create new post
- GET `/api/posts/allpost` - Get all posts

### Messages
- POST `/api/messages/send` - Send message
- GET `/api/messages/:userId` - Get conversation with user

### Achievements
- POST `/api/achievements/add` - Add achievement

### LinkedIn
- PUT `/api/linkedin/url` - Sync LinkedIn profile

## MongoDB Schema Details

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String,
  batch: String,
  branch: String,
  jobTitle: String,
  graduationYear: Number,
  location: String,
  tags: [String],
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  isVerified: Boolean,
  linkedinUrl: String
}
```

### Post Schema
```javascript
{
  author: ObjectId,
  content: String,
  mediaUrl: String,
  tags: [String],
  comments: [{
    commenter: ObjectId,
    text: String,
    createdAt: Date
  }],
  likes: [ObjectId]
}
```

### Message Schema
```javascript
{
  sender: ObjectId,
  recipient: ObjectId,
  content: String,
  timestamp: Date
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.