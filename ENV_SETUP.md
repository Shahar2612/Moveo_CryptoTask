# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/crypto-dashboard

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional API Keys (APIs work without keys but with limitations)
COINGECKO_API_KEY=
CRYPTOPANIC_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
```

## Notes:

- **MongoDB**: Make sure MongoDB is installed and running locally, or use MongoDB Atlas (cloud)
- **JWT_SECRET**: Use a strong random string in production (e.g., `openssl rand -base64 32`)
- **API Keys**: All APIs have fallback mechanisms, so the app works without keys (with rate limits)

## Getting API Keys (Optional):

1. **CoinGecko**: https://www.coingecko.com/api (Free tier available)
2. **CryptoPanic**: https://cryptopanic.com/developers/api/ (Free tier available)
3. **OpenRouter**: https://openrouter.ai/keys (Free models available)
4. **Hugging Face**: https://huggingface.co/settings/tokens (Free tier available)

