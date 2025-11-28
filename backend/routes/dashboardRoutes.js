const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const dashboardController = require('../controllers/dashboardController');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// validation rules
const voteValidation = [
  body('sectionType')
    .isIn(['market-news', 'coin-prices', 'ai-insight', 'meme'])
    .withMessage('Invalid section type'),
  body('contentId').notEmpty().withMessage('Content ID is required'),
  body('vote').isIn(['up', 'down']).withMessage('Vote must be either "up" or "down"'),
];


router.get('/', protect, dashboardController.getDashboard);
router.post('/vote', protect, voteValidation, validate, dashboardController.submitVote);
router.get('/votes', protect, dashboardController.getUserVotes);

module.exports = router;

