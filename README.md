# Crypto Dashboard Backend

A Node.js backend for a personalized crypto investor dashboard built with MVC architecture.

## Features

- **Authentication**: JWT-based signup/login system
- **Onboarding**: User preference collection (assets, investor type, content preferences)
- **Daily Dashboard**: 
  - Market News (CryptoPanic API)
  - Coin Prices (CoinGecko API)
  - AI Insights (OpenRouter/Hugging Face)
  - Crypto Memes (Reddit/Static)
- **Voting System**: Thumbs up/down for content recommendations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Architecture**: MVC (Models, Views, Controllers)

## Project Structure

```
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── onboardingController.js  # Onboarding logic
│   └── dashboardController.js   # Dashboard logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Request validation middleware
├── models/
│   ├── User.js              # User model
│   ├── UserPreferences.js   # User preferences model
│   └── Vote.js              # Vote model
├── routes/
│   ├── authRoutes.js        # Auth routes
│   ├── onboardingRoutes.js  # Onboarding routes
│   └── dashboardRoutes.js   # Dashboard routes
├── services/
│   ├── coinGeckoService.js  # CoinGecko API integration
│   ├── cryptoPanicService.js # CryptoPanic API integration
│   ├── aiService.js         # AI service integration
│   └── memeService.js       # Meme service
├── server.js                # Main server file
└── package.json
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crypto-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional API Keys
COINGECKO_API_KEY=
CRYPTOPANIC_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## API Endpoints

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

## API Usage Examples

### Signup
```bash
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Save Preferences
```bash
POST /api/onboarding
Headers: { "Authorization": "Bearer <token>" }
{
  "interestedAssets": ["bitcoin", "ethereum", "solana"],
  "investorType": "HODLer",
  "contentPreferences": ["Market News", "Charts", "Fun"]
}
```

### Get Dashboard
```bash
GET /api/dashboard
Headers: { "Authorization": "Bearer <token>" }
```

### Submit Vote
```bash
POST /api/dashboard/vote
Headers: { "Authorization": "Bearer <token>" }
{
  "sectionType": "market-news",
  "contentId": "article-123",
  "vote": "up"
}
```

## External APIs Used

- **CoinGecko**: Free tier for coin prices (no API key required for basic usage)
- **CryptoPanic**: News API (works without key for limited requests)
- **OpenRouter**: Free AI models available
- **Hugging Face**: Free inference API
- **Reddit**: Public API for memes (no auth needed)

## Notes

- All APIs have fallback mechanisms if they fail
- The system works with or without API keys (with limitations)
- JWT tokens expire after 30 days
- All protected routes require Bearer token in Authorization header

