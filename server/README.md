# StackIt Backend

Backend API for StackIt Q&A platform built with Node.js, Express, and MongoDB.

## Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/             # Business logic (to be implemented)
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── errorHandler.js     # Global error handling
├── models/
│   ├── User.js             # User schema
│   ├── Question.js         # Question schema
│   ├── Answer.js           # Answer schema
│   ├── Tag.js              # Tag schema
│   └── Notification.js     # Notification schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User management routes
│   ├── questions.js        # Question CRUD routes
│   ├── answers.js          # Answer CRUD routes
│   ├── votes.js            # Voting system routes
│   ├── tags.js             # Tag management routes
│   └── notifications.js    # Notification routes
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── server.js               # Entry point
```

## Features

- **User Management**: Registration, login, profile management
- **Questions & Answers**: Full CRUD operations
- **Voting System**: Upvote/downvote questions and answers
- **Tagging**: Categorize questions with tags
- **Notifications**: Real-time notifications for user interactions
- **Authentication**: JWT-based authentication
- **Security**: Rate limiting, CORS, helmet protection

## Models Overview

### User Model
- Username, email, password (hashed)
- Role-based access (user/admin)
- Reputation system
- Question and answer tracking

### Question Model
- Title, description (rich text)
- Author reference
- Tags array
- Voting system
- Answer tracking
- View count

### Answer Model
- Content (rich text)
- Author and question references
- Voting system
- Acceptance status

### Tag Model
- Name, description, color
- Question count tracking

### Notification Model
- Recipient, sender references
- Notification type and message
- Related question/answer references
- Read status

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your configuration

3. Start development server:
   ```bash
   npm run dev
   ```

## TODO

1. Implement controller functions for each route
2. Add input validation and sanitization
3. Implement file upload for images
4. Add email notifications
5. Set up real-time notifications with Socket.io
6. Add search functionality
7. Implement caching with Redis
