# 🤖 PrepAI — AI Mock Test Platform

PrepAI is a full-stack AI-powered mock test platform designed to help students and job seekers prepare for technical interviews and placement examinations.

The platform generates technical multiple-choice questions using the Groq API, provides an interactive test experience, evaluates performance, and helps users identify areas that need improvement.

## 🚀 Features

- 🔐 **User Authentication**
  - Google OAuth 2.0 authentication
  - JWT-based authentication
  - Secure user account management

- 🤖 **AI-Generated Questions**
  - Generates technical MCQs using the Groq API
  - Supports multiple technical topics
  - Uses previous test/session history to reduce repeated questions

- 📝 **Interactive Test Runner**
  - Countdown timer
  - Question navigation
  - Question status tracking
  - Automatic submission when the timer expires
  - Real-time answer selection

- 📊 **Performance Dashboard**
  - Track previous test results
  - View performance trends
  - Identify weak areas
  - Review test performance over time

- 🗄️ **Persistent Data**
  - MongoDB used to store users, test sessions, questions, and performance data

- 🌐 **Production Deployment**
  - Frontend deployed using Vercel
  - Backend deployed using Render
  - MongoDB Atlas used for cloud database hosting

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- Google OAuth 2.0

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### AI

- Groq API

### Tools & Deployment

- Git
- GitHub
- Postman
- Vercel
- Render

## 📁 Project Structure

```text
ai_mock_test/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas account
- Git
- Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/itskasaudhan/ai_mock_test.git
```

```bash
cd ai_mock_test
```

## 💻 Frontend Setup

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on the Vite development server.

## 🖥️ Backend Setup

Open another terminal and navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

If your server uses a different start command, use the command configured in the `server/package.json`.

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> Never commit your `.env` file or expose API keys and authentication secrets publicly.

## 🔄 How It Works

```text
User
  │
  ▼
React Frontend
  │
  ▼
Express REST API
  │
  ├──────────────► MongoDB
  │
  └──────────────► Groq API
                       │
                       ▼
                 AI Generated MCQs
                       │
                       ▼
                 Test Evaluation
                       │
                       ▼
              Performance Dashboard
```

## 🧠 AI Question Generation

PrepAI uses the Groq API to generate technical multiple-choice questions dynamically.

The application maintains test/session information in MongoDB so that previously generated questions can be considered when generating subsequent tests, helping reduce question repetition.

## 🔐 Authentication

The application supports secure authentication using:

- Google OAuth 2.0
- JSON Web Tokens (JWT)
- Protected backend routes
- Secure environment variables

Authentication allows users to securely access their test sessions and performance information.

## 📊 Performance Tracking

After completing a test, users can view their results and track their performance.

The dashboard helps users:

- Review previous scores
- Monitor performance trends
- Identify weak topics
- Improve preparation based on previous results

## 🎯 Use Cases

PrepAI can be used for:

- Technical interview preparation
- Campus placement preparation
- Programming fundamentals practice
- Computer Science subject revision
- Self-assessment before technical interviews

## 🌱 Future Improvements

Some potential improvements include:

- [ ] More question categories
- [ ] Difficulty-level selection
- [ ] Detailed topic-wise analytics
- [ ] Leaderboard
- [ ] Personalized question recommendations
- [ ] Improved AI-based performance analysis
- [ ] More authentication providers
- [ ] Coding question support


```

## 👨‍💻 Author

**Pawan Kumar Kasaudhan**

Full Stack Developer | MERN Stack

- GitHub: https://github.com/itskasaudhan
- LinkedIn: https://www.linkedin.com/in/pawan-kasaudhan-b0ba09343/

---

⭐ If you find this project useful, consider giving the repository a star!
```

