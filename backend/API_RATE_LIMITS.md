# API Rate Limits & Solutions

## Current Issues & Solutions

### CoinGecko API (429 Error - Rate Limit)

**Problem**: Free tier has rate limits (10-50 calls/minute)

**Solutions Implemented**:
1. ✅ Automatic fallback to static data when rate limit is hit
2. ✅ Support for API key (add to `.env` for higher limits)
3. ✅ Graceful error handling

**To Get Higher Limits**:
1. Sign up at https://www.coingecko.com/api
2. Get your free API key
3. Add to `.env`: `COINGECKO_API_KEY=your-key-here`
4. This gives you 10,000 calls/month (free tier)

### CryptoPanic API (404 Error)

**Problem**: API endpoint may require authentication or has changed

**Solutions Implemented**:
1. ✅ Automatic fallback to static news when API fails
2. ✅ Better error handling for 404 responses
3. ✅ Personalized fallback news based on user preferences

**To Get API Access**:
1. Sign up at https://cryptopanic.com/developers/api/
2. Get your API key (free tier available)
3. Add to `.env`: `CRYPTOPANIC_API_KEY=your-key-here`

## Current Behavior

When APIs fail:
- **Coin Prices**: Shows fallback prices for selected coins
- **Market News**: Shows personalized fallback news articles
- **AI Insight**: Uses static insights (always has fallback)
- **Memes**: Uses static memes (always has fallback)

The dashboard will **always work** even if all APIs fail!

## Best Practices

1. **Don't refresh the dashboard too frequently** - Wait at least 1 minute between refreshes
2. **Add API keys** for better rate limits (all free tiers available)
3. **The app is designed to work without API keys** - fallbacks ensure functionality

## Rate Limit Recommendations

- **CoinGecko**: Max 1 request per 6 seconds (free tier)
- **CryptoPanic**: Varies by plan (free tier has limits)
- **OpenRouter**: Free tier available with rate limits
- **Hugging Face**: Free tier with rate limits

All services have automatic fallbacks, so your app will always function!

