# Crypto Dashboard - Full Stack Application

A personalized crypto investor dashboard with AI-curated content, built with Node.js (MVC) backend and React frontend.

## 🚀 Features

- **Authentication**: JWT-based signup/login system
- **Onboarding**: Personalized quiz to understand user preferences
- **Daily Dashboard**: 
  - 📰 Market News (CryptoPanic API)
  - 💰 Coin Prices (CoinGecko API)
  - 🤖 AI Insight of the Day (OpenRouter/Hugging Face)
  - 😄 Fun Crypto Memes (Reddit/Static)
- **Voting System**: Thumbs up/down for content recommendations

## 📁 Project Structure

```
.
├── backend/          # Node.js MVC backend
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth & validation middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── services/     # External API integrations
│   └── server.js     # Express server
│
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- MVC Architecture

### Frontend
- React 18
- React Router
- Vite
- Axios

## 📦 Installation

### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crypto-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start the server:
```bash
npm run dev
```

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🌐 Running the Application

1. **Start MongoDB** (local or use MongoDB Atlas)
2. **Start Backend**: `cd backend && npm run dev` (runs on port 3000)
3. **Start Frontend**: `cd frontend && npm run dev` (runs on port 3001)
4. **Open Browser**: Navigate to `http://localhost:3001`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Onboarding
- `POST /api/onboarding` - Save user preferences (Protected)
- `GET /api/onboarding` - Get user preferences (Protected)

### Dashboard
- `GET /api/dashboard` - Get daily dashboard content (Protected)
- `POST /api/dashboard/vote` - Submit vote for content (Protected)
- `GET /api/dashboard/votes` - Get user's votes (Protected)

## 🔑 Environment Variables

See `backend/ENV_SETUP.md` for detailed environment variable setup.

## 📚 Documentation

- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`

## 🎯 Usage Flow

1. **Sign Up** - Create a new account
2. **Onboarding** - Complete the quiz about your crypto interests
3. **Dashboard** - View personalized content and vote on recommendations

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

ISC

