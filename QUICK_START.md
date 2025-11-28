# Quick Start Guide

Get your Crypto Dashboard up and running in minutes!

## Prerequisites

- Node.js 16+ installed
- MongoDB running (local or MongoDB Atlas)

## Step 1: Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crypto-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

## Step 2: Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:3001`

## Step 3: Use the Application

1. Open your browser and go to `http://localhost:3001`
2. **Sign Up** - Create a new account
3. **Complete Onboarding** - Answer the quiz questions
4. **View Dashboard** - See your personalized crypto content!

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 3000 is available

### Frontend won't connect to backend
- Make sure backend is running on port 3000
- Check browser console for errors
- Verify proxy settings in `frontend/vite.config.js`

### MongoDB connection issues
- For local MongoDB: Make sure MongoDB service is running
- For MongoDB Atlas: Check connection string and network access settings
- See `backend/ENV_SETUP.md` for detailed MongoDB setup

## Next Steps

- Add API keys to `.env` for better API limits (optional)
- Customize the dashboard styling
- Add more features!

Happy coding! 🚀

