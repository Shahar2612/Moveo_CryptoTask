const axios = require('axios');

// static meme database (fallback)
const STATIC_MEMES = [
  {
    id: 'meme-1',
    title: 'HODL Strong',
    url: 'https://i.imgur.com/example1.jpg',
    description: 'When you HODL through the dip',
  },
  {
    id: 'meme-2',
    title: 'To the Moon',
    url: 'https://i.imgur.com/example2.jpg',
    description: 'When your coin pumps',
  },
  {
    id: 'meme-3',
    title: 'Diamond Hands',
    url: 'https://i.imgur.com/example3.jpg',
    description: 'Never selling',
  },
  {
    id: 'meme-4',
    title: 'Buy the Dip',
    url: 'https://i.imgur.com/example4.jpg',
    description: 'This is the way',
  },
  {
    id: 'meme-5',
    title: 'Crypto Market',
    url: 'https://i.imgur.com/example5.jpg',
    description: 'When you check the charts',
  },
];

  //get random crypto meme
  //@returns {Promise<Object>} meme data
 
const getRandomMeme = async () => {
  try {
    // try to fetch from Reddit API (free, no auth needed)
    return await getRedditMeme();
  } catch (error) {
    console.error('Meme Service Error:', error.message);
    // fallback to static meme
    return getStaticMeme();
  }
};

  //get meme from Reddit r/cryptomemes
  //@returns {Promise<Object>} meme data
 
const getRedditMeme = async () => {
  try {
    const response = await axios.get(
      'https://www.reddit.com/r/cryptomemes/hot.json?limit=10',
      {
        timeout: 10000,
      }
    );

    const posts = response.data.data.children
      .filter(post => post.data.post_hint === 'image' && !post.data.over_18)
      .slice(0, 5);

    if (posts.length === 0) {
      return getStaticMeme();
    }

    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    return {
      id: randomPost.data.id,
      title: randomPost.data.title,
      url: randomPost.data.url,
      source: 'Reddit r/cryptomemes',
      author: randomPost.data.author,
      upvotes: randomPost.data.ups,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Reddit API Error:', error.message);
    throw error;
  }
};

  //get static meme from local database
  //@returns {Object} static meme data
 
const getStaticMeme = () => {
  const randomMeme = STATIC_MEMES[Math.floor(Math.random() * STATIC_MEMES.length)];

  return {
    ...randomMeme,
    source: 'Static Database',
    timestamp: new Date().toISOString(),
    fallback: true,
  };
};

module.exports = {
  getRandomMeme,
};

