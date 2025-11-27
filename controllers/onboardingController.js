const User = require('../models/User');
const UserPreferences = require('../models/UserPreferences');

// @desc    save user onboarding preferences
// @route   POST /api/onboarding
// @access  private
exports.savePreferences = async (req, res) => {
  try {
    const { interestedAssets, investorType, contentPreferences } = req.body;
    const userId = req.user.id;

    // validate required fields
    if (!interestedAssets || !investorType || !contentPreferences) {
      return res.status(400).json({
        success: false,
        message: 'please provide all required fields: interestedAssets, investorType, contentPreferences',
      });
    }

    // update or create preferences
    let preferences = await UserPreferences.findOne({ userId });
    
    if (preferences) {
      preferences.interestedAssets = interestedAssets;
      preferences.investorType = investorType;
      preferences.contentPreferences = contentPreferences;
      await preferences.save();
    } else {
      preferences = await UserPreferences.create({
        userId,
        interestedAssets,
        investorType,
        contentPreferences,
      });
    }

    // mark user as having completed onboarding
    await User.findByIdAndUpdate(userId, { hasCompletedOnboarding: true });

    res.status(200).json({
      success: true,
      message: 'preferences saved successfully',
      data: {
        preferences,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

// @desc    get user preferences
// @route   GET /api/onboarding
// @access  private
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const preferences = await UserPreferences.findOne({ userId });

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: 'preferences not found. please complete onboarding.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        preferences,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

