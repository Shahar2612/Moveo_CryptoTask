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

### Option 1: Single Command (Recommended)

From the root directory, run:
```bash
npm run dev
```

This will start both backend and frontend servers simultaneously.

**Note**: First time setup - install dependencies:
```bash
npm install  # Install concurrently
cd backend && npm install
cd ../frontend && npm install
```

### Option 2: Using Scripts

**Windows (PowerShell):**
```powershell
.\start-dev.ps1
```

**Windows (Command Prompt):**
```cmd
start-dev.bat
```

### Option 3: Manual Start

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

## 🧠 Future Model Training & Improvement

The voting system collects valuable feedback data that can be used to train and improve the AI recommendation model. Here's a suggested approach for future implementation:

### Data Collection

The app currently stores all user votes in the `Vote` collection with the following structure:
- **User ID**: Links feedback to specific users
- **Section Type**: Identifies content category (market-news, coin-prices, ai-insight, meme)
- **Content ID**: Identifies the specific content item
- **Vote**: Thumbs up (up) or thumbs down (down)
- **Timestamp**: When the vote was cast

### Suggested Training Process

1. **Data Aggregation**
   - Collect votes over time to build a training dataset
   - Aggregate votes by content type, user preferences, and content characteristics
   - Calculate engagement metrics (upvote rate, downvote rate, total votes)

2. **Feature Engineering**
   - Combine vote data with user preferences (investor type, interested assets, content preferences)
   - Extract content features (news source, coin market cap, AI model used, etc.)
   - Create user-content interaction features

3. **Model Training Approaches**
   - **Collaborative Filtering**: Use vote patterns to find similar users and recommend content they liked
   - **Content-Based Filtering**: Learn which content features correlate with positive votes
   - **Hybrid Approach**: Combine both methods for better recommendations
   - **Reinforcement Learning**: Use votes as rewards to train the AI insight generation model

4. **Implementation Suggestions**
   - **Batch Processing**: Periodically (daily/weekly) analyze vote data and retrain models
   - **A/B Testing**: Test different recommendation algorithms and measure improvement
   - **Feedback Loop**: Use improved recommendations → collect more votes → retrain → improve further
   - **Personalization**: Train user-specific models based on individual voting patterns

5. **Metrics to Track**
   - Overall upvote rate improvement over time
   - User engagement (more votes = more engagement)
   - Content diversity (ensuring variety in recommendations)
   - User retention (better recommendations = happier users)

### Current Data Structure

All votes are stored in MongoDB and can be queried for analysis:
```javascript
// Example: Get all votes for AI insights
Vote.find({ sectionType: 'ai-insight' })

// Example: Get user's voting patterns
Vote.find({ userId: userId }).populate('userId')
```

This data foundation enables future machine learning implementations to improve content recommendations and personalize the dashboard experience.



