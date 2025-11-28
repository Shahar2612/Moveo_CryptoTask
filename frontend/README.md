# Crypto Dashboard Frontend

React frontend for the personalized crypto investor dashboard.

## Features

- 🔐 **Authentication**: Login and Signup with JWT
- 📝 **Onboarding**: Personalized quiz to understand user preferences
- 📊 **Dashboard**: 
  - Market News (CryptoPanic API)
  - Coin Prices (CoinGecko API)
  - AI Insight of the Day
  - Fun Crypto Memes
- 👍 **Voting System**: Thumbs up/down for content recommendations

## Tech Stack

- **React 18** - UI library
- **React Router** - Routing
- **Vite** - Build tool
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Navigate to the frontend directory:
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

The app will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React Context (Auth)
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Onboarding.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## API Configuration

The frontend is configured to proxy API requests to the backend running on `http://localhost:3000`. This is set up in `vite.config.js`.

Make sure the backend server is running before using the frontend.

## Environment Variables

No environment variables are required for the frontend. All API calls are proxied through Vite to the backend.

