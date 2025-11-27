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

    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: coins,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_market_cap: true,
      },
      timeout: 10000,
    });

    // format the response
    const formattedData = Object.entries(response.data).map(([id, data]) => ({
      id,
      symbol: id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      price: data.usd,
      change24h: data.usd_24h_change,
      marketCap: data.usd_market_cap,
    }));

    return {
      coins: formattedData,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('CoinGecko API Error:', error.message);
    throw new Error('Failed to fetch coin prices from CoinGecko');
  }
};

  //get trending coins
  //@returns {Promise<Object>} trending coins data
 
const getTrendingCoins = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/search/trending`, {
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

