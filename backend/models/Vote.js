const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sectionType: {
    type: String,
    enum: ['market-news', 'coin-prices', 'ai-insight', 'meme'],
    required: true,
  },
  contentId: {
    type: String,
    required: true,
    // for examples: article ID, coin symbol
  },
  vote: {
    type: String,
    enum: ['up', 'down'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// compound index to prevent duplicate votes on same content
voteSchema.index({ userId: 1, sectionType: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);

