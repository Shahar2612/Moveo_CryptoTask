const axios = require('axios');


  //get daily AI insight based on user preferences
  //@param {Object} preferences - user preferences object
  //@returns {Promise<Object>} AI insight data
 
const getDailyInsight = async (preferences) => {
  try {
    // build prompt based on user preferences
    const investorType = preferences?.investorType || 'HODLer';
    const assets = preferences?.interestedAssets?.join(', ') || 'Bitcoin, Ethereum';
    const contentPrefs = preferences?.contentPreferences?.join(', ') || 'Market News';

    const prompt = `Provide a brief, insightful daily crypto market analysis (2-3 sentences) for a ${investorType} interested in ${assets}. Focus on: ${contentPrefs}. Keep it concise and actionable.`;

    // try OpenRouter first (free tier available)
    if (process.env.OPENROUTER_API_KEY) {
      return await getOpenRouterInsight(prompt);
    }

    // try Hugging Face Inference API
    if (process.env.HUGGINGFACE_API_KEY) {
      return await getHuggingFaceInsight(prompt);
    }

    // fallback to static insight
    return getFallbackInsight(preferences);
  } catch (error) {
    console.error('AI Service Error:', error.message);
    return getFallbackInsight(preferences);
  }
};


  //get insight from OpenRouter API
  //@param {string} prompt - the prompt to send
  //@returns {Promise<Object>} AI insight
 
const getOpenRouterInsight = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
        messages: [
          {
            role: 'system',
            content: 'you are a helpful crypto market analyst providing daily insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    return {
      insight: response.data.choices[0]?.message?.content || 'Market analysis unavailable.',
      model: 'OpenRouter (Llama 3.2)',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    throw error;
  }
};


  //get insight from Hugging Face Inference API
  //@param {string} prompt - the prompt to send
  //@returns {Promise<Object>} AI insight
 
const getHuggingFaceInsight = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        inputs: prompt,
        parameters: {
          max_length: 150,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        timeout: 15000,
      }
    );

    const insight = Array.isArray(response.data)
      ? response.data[0]?.generated_text || 'Market analysis unavailable.'
      : response.data?.generated_text || 'Market analysis unavailable.';

    return {
      insight: insight.replace(prompt, '').trim() || 'Market analysis unavailable.',
      model: 'Hugging Face (DialoGPT)',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Hugging Face API Error:', error.message);
    throw error;
  }
};


  //fallback static insight when AI APIs fail
  //@param {Object} preferences - user preferences
  //@returns {Object} static insight
 
const getFallbackInsight = (preferences) => {
  const investorType = preferences?.investorType || 'investor';
  const assets = preferences?.interestedAssets?.join(' and ') || 'major cryptocurrencies';

  const fallbackInsights = [
    `For ${investorType}s, ${assets} continue to show resilience in the current market. Consider monitoring key support levels and staying informed about upcoming developments.`,
    `Today's market presents opportunities for ${investorType}s interested in ${assets}. Keep an eye on volume trends and major news events that could impact prices.`,
    `The crypto market for ${assets} remains dynamic. ${investorType}s should focus on long-term fundamentals while staying alert to short-term volatility.`,
  ];

  const randomInsight = fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)];

  return {
    insight: randomInsight,
    model: 'Static Fallback',
    timestamp: new Date().toISOString(),
    fallback: true,
  };
};

module.exports = {
  getDailyInsight,
};

