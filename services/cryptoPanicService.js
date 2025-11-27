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
    });

    // format the response
    const news = response.data.results.slice(0, 10).map(item => ({
      id: item.id.toString(),
      title: item.title,
      url: item.url,
      source: item.source?.title || 'Unknown',
      publishedAt: item.published_at,
      votes: item.votes,
      metadata: {
        kind: item.kind,
        domain: item.domain,
      },
    }));

    return {
      articles: news,
      count: news.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('CryptoPanic API Error:', error.message);
    
    // fallback to static news if API fails
    return getFallbackNews();
  }
};

  //fallback static news when API fails
  //@returns {Object} static news data
 
const getFallbackNews = () => {
  return {
    articles: [
      {
        id: 'fallback-1',
        title: 'Bitcoin reaches new milestone',
        url: '#',
        source: 'Crypto News',
        publishedAt: new Date().toISOString(),
        votes: { positive: 0, negative: 0 },
        metadata: { kind: 'news', domain: 'cryptonews.com' },
      },
      {
        id: 'fallback-2',
        title: 'Ethereum network upgrade announced',
        url: '#',
        source: 'Blockchain Daily',
        publishedAt: new Date().toISOString(),
        votes: { positive: 0, negative: 0 },
        metadata: { kind: 'news', domain: 'blockchaindaily.com' },
      },
    ],
    count: 2,
    timestamp: new Date().toISOString(),
    fallback: true,
  };
};

module.exports = {
  getMarketNews,
};

