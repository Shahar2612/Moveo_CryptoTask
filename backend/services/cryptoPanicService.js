const axios = require('axios');

const CRYPTOPANIC_API_URL = 'https://cryptopanic.com/api/v1/posts';


  //get market news based on user preferences
  //@param {Object} preferences - user preferences object
  //@returns {Promise<Object>} market news data
 
const getMarketNews = async (preferences) => {
  try {
    // build filter based on user's interested assets
    const filter = preferences?.interestedAssets?.length > 0
      ? preferences.interestedAssets.join(',')
      : 'BTC,ETH';

    const params = {
      auth_token: process.env.CRYPTOPANIC_API_KEY || '',
      public: true,
      filter: 'hot', // hot, rising, bull, bear
      currencies: filter,
    };

    // remove auth_token if not provided (API works without it for limited requests)
    if (!params.auth_token) {
      delete params.auth_token;
    }

    const response = await axios.get(CRYPTOPANIC_API_URL, {
      params,
      timeout: 10000,
      validateStatus: (status) => status < 500, // Don't throw on 404
    });

    // Check if response is successful and has data
    if (response.status === 404 || !response.data || !response.data.results) {
      // Silently use fallback - this is expected behavior when API is unavailable
      return getFallbackNews(preferences);
    }

    // format the response
    const news = (response.data.results || []).slice(0, 10).map(item => ({
      id: item.id?.toString() || `news-${Date.now()}-${Math.random()}`,
      title: item.title || 'Crypto News Update',
      url: item.url || '#',
      source: item.source?.title || 'Crypto News',
      publishedAt: item.published_at || new Date().toISOString(),
      votes: item.votes || { positive: 0, negative: 0 },
      metadata: {
        kind: item.kind || 'news',
        domain: item.domain || 'cryptonews.com',
      },
    }));

    if (news.length === 0) {
      return getFallbackNews(preferences);
    }

    return {
      articles: news,
      count: news.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Silently fallback to static news - this is expected when API is unavailable
    // Only log actual errors (not 404s which are expected without API key)
    if (error.response?.status && error.response.status !== 404) {
      console.error('CryptoPanic API Error:', error.message);
    }
    
    // fallback to static news if API fails
    return getFallbackNews(preferences);
  }
};

  //fallback static news when API fails
  //@param {Object} preferences - user preferences for personalized news
  //@returns {Object} static news data
 
const getFallbackNews = (preferences) => {
  const assets = preferences?.interestedAssets || ['bitcoin', 'ethereum'];
  const assetNames = assets.map(a => a.charAt(0).toUpperCase() + a.slice(1));
  
  const fallbackArticles = [
    {
      id: 'fallback-1',
      title: `${assetNames[0] || 'Bitcoin'} shows strong market performance`,
      url: '#',
      source: 'Crypto News',
      publishedAt: new Date().toISOString(),
      votes: { positive: 0, negative: 0 },
      metadata: { kind: 'news', domain: 'cryptonews.com' },
    },
    {
      id: 'fallback-2',
      title: `${assetNames[1] || 'Ethereum'} network upgrade announced`,
      url: '#',
      source: 'Blockchain Daily',
      publishedAt: new Date().toISOString(),
      votes: { positive: 0, negative: 0 },
      metadata: { kind: 'news', domain: 'blockchaindaily.com' },
    },
    {
      id: 'fallback-3',
      title: 'Crypto market analysis: Trends and predictions',
      url: '#',
      source: 'Market Watch',
      publishedAt: new Date().toISOString(),
      votes: { positive: 0, negative: 0 },
      metadata: { kind: 'news', domain: 'marketwatch.com' },
    },
    {
      id: 'fallback-4',
      title: 'DeFi sector continues to grow',
      url: '#',
      source: 'DeFi Pulse',
      publishedAt: new Date().toISOString(),
      votes: { positive: 0, negative: 0 },
      metadata: { kind: 'news', domain: 'defipulse.com' },
    },
  ];

  return {
    articles: fallbackArticles,
    count: fallbackArticles.length,
    timestamp: new Date().toISOString(),
    fallback: true,
  };
};

module.exports = {
  getMarketNews,
};

