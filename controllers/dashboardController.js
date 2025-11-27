const UserPreferences = require('../models/UserPreferences');
const Vote = require('../models/Vote');
const coinGeckoService = require('../services/coinGeckoService');
const cryptoPanicService = require('../services/cryptoPanicService');
const aiService = require('../services/aiService');
const memeService = require('../services/memeService');

// @desc    get daily dashboard content
// @route   GET /api/dashboard
// @access  private
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // get user preferences
    const preferences = await UserPreferences.findOne({ userId });
    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: 'please complete onboarding first',
      });
    }

    // fetch all dashboard sections in parallel
    const [marketNews, coinPrices, aiInsight, meme] = await Promise.allSettled([
      cryptoPanicService.getMarketNews(preferences),
      coinGeckoService.getCoinPrices(preferences.interestedAssets),
      aiService.getDailyInsight(preferences),
      memeService.getRandomMeme(),
    ]);

    // build response with error handling
    const dashboard = {
      marketNews: marketNews.status === 'fulfilled' 
        ? { success: true, data: marketNews.value }
        : { success: false, error: marketNews.reason?.message || 'failed to fetch market news' },
      
      coinPrices: coinPrices.status === 'fulfilled'
        ? { success: true, data: coinPrices.value }
        : { success: false, error: coinPrices.reason?.message || 'failed to fetch coin prices' },
      
      aiInsight: aiInsight.status === 'fulfilled'
        ? { success: true, data: aiInsight.value }
        : { success: false, error: aiInsight.reason?.message || 'failed to fetch AI insight' },
      
      meme: meme.status === 'fulfilled'
        ? { success: true, data: meme.value }
        : { success: false, error: meme.reason?.message || 'failed to fetch meme' },
    };

    res.status(200).json({
      success: true,
      message: 'dashboard data retrieved',
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

// @desc    submit vote for dashboard content
// @route   POST /api/dashboard/vote
// @access  private
exports.submitVote = async (req, res) => {
  try {
    const { sectionType, contentId, vote } = req.body;
    const userId = req.user.id;

    // validate input
    if (!sectionType || !contentId || !vote) {
      return res.status(400).json({
        success: false,
        message: 'please provide sectionType, contentId, and vote (up/down)',
      });
    }

    if (!['market-news', 'coin-prices', 'ai-insight', 'meme'].includes(sectionType)) {
      return res.status(400).json({
        success: false,
        message: 'invalid sectionType',
      });
    }

    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({
        success: false,
        message: 'vote must be either "up" or "down"',
      });
    }

      // check if vote already exists
    const existingVote = await Vote.findOne({
      userId,
      sectionType,
      contentId,
    });

    if (existingVote) {
      // update existing vote
      existingVote.vote = vote;
      await existingVote.save();

      return res.status(200).json({
        success: true,
        message: 'vote updated successfully',
        data: { vote: existingVote },
      });
    }

    // create new vote
    const newVote = await Vote.create({
      userId,
      sectionType,
      contentId,
      vote,
    });

    res.status(201).json({
      success: true,
      message: 'vote submitted successfully',
      data: { vote: newVote },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'duplicate vote detected',
      });
    }
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

// @desc    get user's votes
// @route   GET /api/dashboard/votes
// @access  private
exports.getUserVotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const votes = await Vote.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { votes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

