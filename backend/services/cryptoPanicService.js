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
      filter: 'hot', // hot, rising, bull, bear
      currencies: filter,
    };

    // remove auth_token if not provided (API works without it for limited requests)
    if (!params.auth_token) {
      delete params.auth_token;
    }
    
    // Remove empty currencies if filter is empty
    if (!filter || filter.trim() === '') {
      delete params.currencies;
    }

    const response = await axios.get(CRYPTOPANIC_API_URL, {
      params,
      timeout: 10000,
      validateStatus: (status) => status < 500, 
    });

    // Check if response is successful and has data
    if (response.status !== 200 || !response.data || !response.data.results || response.data.results.length === 0) {
      // API returned error or no data - use fallback
      return getFallbackNews(preferences);
    }

    // format the response
    const news = (response.data.results || []).slice(0, 10).map(item => {
      // CryptoPanic API returns the URL in different possible fields
      // Try to get the URL from various possible fields
      let articleUrl = item.url || item.link || item.source?.url;
      
      // If we have an ID but no URL, construct CryptoPanic URL
      if (!articleUrl && item.id) {
        articleUrl = `https://cryptopanic.com/news/${item.id}/`;
      }
      
      // If URL doesn't start with http/https, it might be a relative URL
      if (articleUrl && !articleUrl.startsWith('http')) {
        articleUrl = `https://cryptopanic.com${articleUrl.startsWith('/') ? '' : '/'}${articleUrl}`;
      }
      
      // Final fallback if still no URL
      if (!articleUrl || articleUrl === '#') {
        articleUrl = 'https://cryptopanic.com/news/';
      }
      
      return {
        id: item.id?.toString() || `news-${Date.now()}-${Math.random()}`,
        title: item.title || 'Crypto News Update',
        url: articleUrl,
        source: item.source?.title || item.domain || 'Crypto News',
        publishedAt: item.published_at || item.created_at || new Date().toISOString(),
        votes: item.votes || { positive: 0, negative: 0 },
        metadata: {
          kind: item.kind || 'news',
          domain: item.domain || 'cryptonews.com',
        },
      };
    });

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
  
  // Use real crypto news sources for fallback
  const fallbackArticles = [
    {
      id: 'fallback-1',
      title: `${assetNames[0] || 'Bitcoin'} shows strong market performance`,
      url: `https://cryptopanic.com/news/?currencies=${assets[0]?.toUpperCase() || 'BTC'}`,
      source: 'CryptoPanic',
      publishedAt: new Date().toISOString(),
      votes: { positive: 0, negative: 0 },
      metadata: { kind: 'news', domain: 'cryptopanic.com' },
    },
    {
      id: 'fallback-2',
      title: `${assetNames[1] || 'Ethereum'} network upgrade announced`,
      url: `https://cryptopanic.com/news/?currencies=${assets[1]?.toUpperCase() || 'ETH'}`,
      source: 'CryptoPanic',
      publishedAt: new Date().toISOString(),
      votes: { positive: 0, negative: 0 },
      metadata: { kind: 'news', domain: 'cryptopanic.com' },
    },
    {
      id: 'fallback-3',
      title: 'Latest cryptocurrency market news and analysis',
      url: 'https://cryptopanic.com/news/',
      source: 'CryptoPanic',
      publishedAt: new Date().toISOString(),
      votes: { positive: 0, negative: 0 },
      metadata: { kind: 'news', domain: 'cryptopanic.com' },
    },
    {
      id: 'fallback-4',
      title: 'Crypto market trends and blockchain updates',
      url: 'https://www.coindesk.com/',
      source: 'CoinDesk',
      publishedAt: new Date().toISOString(),
      votes: { positive: 0, negative: 0 },
      metadata: { kind: 'news', domain: 'coindesk.com' },
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

