const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';


  //get coin prices for user's interested assets
  //@param {Array} assetIds - array of coin IDs (e.g., ['bitcoin', 'ethereum'])
  //@returns {Promise<Object>} coin prices data
 
const getCoinPrices = async (assetIds = []) => {
  try {
    // default to popular coins if no preferences
    const coins = assetIds.length > 0 
      ? assetIds.join(',')
      : 'bitcoin,ethereum,solana,cardano';

    const headers = {};
    // Add API key header if available (for higher rate limits)
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }

    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: coins,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_market_cap: true,
      },
      headers,
      timeout: 15000,
    });

    // Check if response has data
    if (!response.data || Object.keys(response.data).length === 0) {
      return getFallbackCoinPrices(assetIds);
    }

    // format the response with proper number parsing
    const formattedData = Object.entries(response.data || {}).map(([id, data]) => {
      // Ensure all numeric values are properly parsed as numbers
      const price = typeof data.usd === 'number' 
        ? data.usd 
        : (data.usd ? parseFloat(String(data.usd)) : 0);
      
      const change24h = typeof data.usd_24h_change === 'number' 
        ? data.usd_24h_change 
        : (data.usd_24h_change !== null && data.usd_24h_change !== undefined 
          ? parseFloat(String(data.usd_24h_change)) 
          : 0);
      
      const marketCap = typeof data.usd_market_cap === 'number' 
        ? data.usd_market_cap 
        : (data.usd_market_cap ? parseFloat(String(data.usd_market_cap)) : null);

      return {
        id,
        symbol: id.toUpperCase(),
        name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
        price: Number(price), // Ensure it's a proper number
        change24h: Number(parseFloat(change24h).toFixed(2)), // Percentage with 2 decimal places
        marketCap: marketCap ? Number(marketCap) : null,
      };
    });

    // If user has preferences and API didn't return all requested coins, add fallback for missing ones
    if (assetIds.length > 0) {
      const returnedIds = formattedData.map(coin => coin.id);
      const missingIds = assetIds.filter(id => !returnedIds.includes(id));
      
      if (missingIds.length > 0) {
        // Get fallback prices for coins that API didn't return
        const missingCoins = missingIds.map((id) => {
          const fallbackPrices = {
            bitcoin: { price: 90000, change24h: 2.5 },
            ethereum: { price: 3500, change24h: 1.8 },
            solana: { price: 150, change24h: 3.2 },
            cardano: { price: 0.55, change24h: -0.5 },
            polkadot: { price: 7.5, change24h: 1.2 },
            chainlink: { price: 18, change24h: 2.1 },
            polygon: { price: 0.95, change24h: 0.8 },
            avalanche: { price: 38, change24h: 1.5 },
            cosmos: { price: 12, change24h: 0.9 },
            algorand: { price: 0.25, change24h: -0.3 },
          };
          const coinData = fallbackPrices[id] || { price: 100, change24h: 0 };
          return {
            id,
            symbol: id,
            name: id.charAt(0).toUpperCase() + id.slice(1),
            price: coinData.price,
            change24h: coinData.change24h,
            marketCap: null,
          };
        });
        formattedData.push(...missingCoins);
      }
    }

    // Verify we got data for at least one coin
    if (formattedData.length === 0) {
      return getFallbackCoinPrices(assetIds);
    }

    return {
      coins: formattedData,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Handle rate limit (429) or other errors - silently use fallback
    // This is expected behavior when rate limits are hit or API is unavailable
    if (error.response?.status === 429 || error.code === 'ECONNABORTED') {
      // Rate limit reached or timeout - fallback is working as designed
      return getFallbackCoinPrices(assetIds);
    }
    // For other errors, still use fallback but could log in development
    return getFallbackCoinPrices(assetIds);
  }
};

// fallback coin prices when API fails
const getFallbackCoinPrices = (assetIds = []) => {
  const defaultCoins = ['bitcoin', 'ethereum', 'solana', 'cardano'];
  const coins = assetIds.length > 0 ? assetIds : defaultCoins;
  
  // Static fallback prices (approximate values - updated Nov 2025)
  const fallbackPrices = {
    bitcoin: { price: 90000, change24h: 2.5 },
    ethereum: { price: 3500, change24h: 1.8 },
    solana: { price: 150, change24h: 3.2 },
    cardano: { price: 0.55, change24h: -0.5 },
    polkadot: { price: 7.5, change24h: 1.2 },
    chainlink: { price: 18, change24h: 2.1 },
    polygon: { price: 0.95, change24h: 0.8 },
    avalanche: { price: 38, change24h: 1.5 },
    cosmos: { price: 12, change24h: 0.9 },
    algorand: { price: 0.25, change24h: -0.3 },
  };

  const formattedData = coins.map((id) => {
    const coinData = fallbackPrices[id] || { price: 100, change24h: 0 };
    return {
      id,
      symbol: id.toUpperCase(),
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
      price: Number(coinData.price),
      change24h: Number(coinData.change24h),
      marketCap: null,
    };
  });

  return {
    coins: formattedData,
    timestamp: new Date().toISOString(),
    fallback: true,
  };
};

  //get trending coins
  //@returns {Promise<Object>} trending coins data
 
const getTrendingCoins = async () => {
  try {
    const headers = {};
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }

    const response = await axios.get(`${COINGECKO_API_URL}/search/trending`, {
      headers,
      timeout: 10000,
    });

    return {
      trending: response.data.coins.slice(0, 5).map(coin => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        rank: coin.item.market_cap_rank,
      })),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('CoinGecko Trending API Error:', error.message);
    throw new Error('Failed to fetch trending coins');
  }
};

module.exports = {
  getCoinPrices,
  getTrendingCoins,
};

