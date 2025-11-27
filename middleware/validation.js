const { validationResult } = require('express-validator');

// check validation results, next is required to continue to the next middleware or route handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'validation error',
      errors: errors.array(),
    });
  }
  next();
};

