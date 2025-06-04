# Alumni Connect Portal

A web platform that connects alumni with their alma mater and fellow graduates.

## Project Goals & Vision

The Alumni Connect Portal aims to create a dynamic and engaging platform that strengthens the bonds between educational institutions and their graduates. Our primary goals are:

1. **Community Building**
   - Create a vibrant virtual community for alumni interaction
   - Enable seamless networking between different batches
   - Foster mentorship relationships between senior and junior alumni

2. **Knowledge Exchange**
   - Facilitate sharing of industry insights and experiences
   - Create a platform for professional development
   - Enable resource sharing and collaborative learning

3. **Career Development**
   - Provide job posting and career opportunity sharing
   - Enable alumni-to-alumni recruitment
   - Create mentorship programs for recent graduates

4. **Institutional Growth**
   - Strengthen alumni-institution relationships
   - Facilitate alumni contributions to institutional development
   - Create channels for alumni feedback and suggestions

## Why Alumni Connect Portal?

In today's interconnected world, maintaining strong alumni networks is crucial for both educational institutions and their graduates. Our platform addresses several key challenges:

- **Geographic Barriers**: Connects alumni across different locations worldwide
- **Professional Networking**: Creates opportunities for career growth and collaboration
- **Resource Sharing**: Enables knowledge and resource exchange between alumni
- **Engagement**: Keeps alumni engaged with their alma mater through regular updates and events
- **Community Support**: Builds a support system for recent graduates and experienced professionals

## About Project

The Alumni Connect Portal is a comprehensive platform designed to bridge the gap between educational institutions and their alumni. It facilitates networking, knowledge sharing, and career opportunities among alumni while helping institutions maintain strong connections with their graduates.

### Key Objectives

- Foster a strong alumni community
- Enable professional networking
- Share success stories and achievements
- Facilitate mentorship opportunities
- Keep alumni updated with institution news
- Create job and internship opportunities

## Project Structure

```
alumni-connect-portal/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── messageController.js
│   │   ├── postController.js
│   │   └── achievementController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   ├── Post.js
│   │   └── Achievement.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── postRoutes.js
│   │   └── achievementRoutes.js
│   ├── index.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

## Features

- User Authentication & Authorization
- Alumni Profile Management
- Messaging System
- Post Sharing
- LinkedIn Integration
- Achievement Tracking

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   PORT=7000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/messages` - Messaging system
- `/api/posts` - Post management
- `/api/linkedin` - LinkedIn integration
- `/api/achievements` - Achievement tracking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
