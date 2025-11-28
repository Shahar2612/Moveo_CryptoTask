const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  interestedAssets: {
    type: [String],
    default: [],
    // for examples: ['bitcoin', 'ethereum', 'solana', 'cardano']
  },
  investorType: {
    type: String,
    enum: ['HODLer', 'Day Trader', 'NFT Collector', 'DeFi Enthusiast', 'Other'],
    default: 'HODLer',
  },
  contentPreferences: {
    type: [String],
    default: [],
    // for examples: ['market news', 'charts', 'social', 'fun']
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userPreferencesSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);

