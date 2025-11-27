const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const onboardingController = require('../controllers/onboardingController');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// validation rules
const preferencesValidation = [
  body('interestedAssets')
    .isArray({ min: 1 })
    .withMessage('Please select at least one asset of interest'),
  body('investorType')
    .isIn(['HODLer', 'Day Trader', 'NFT Collector', 'DeFi Enthusiast', 'Other'])
    .withMessage('Please select a valid investor type'),
  body('contentPreferences')
    .isArray({ min: 1 })
    .withMessage('Please select at least one content preference'),
];


router.post('/', protect, preferencesValidation, validate, onboardingController.savePreferences);
router.get('/', protect, onboardingController.getPreferences);

module.exports = router;

