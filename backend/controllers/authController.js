const User = require('../models/User');
const jwt = require('jsonwebtoken');

// generate JWT 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    register new user
// @route   POST /api/auth/signup
// @access  public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'user already exists with this email',
      });
    }

    // create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'user registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        },
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

// @desc    login user
// @route   POST /api/auth/login
// @access  public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'invalid credentials',
      });
    }

    // check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'invalid credentials',
      });
    }

    // generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        },
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

// @desc    get current user
// @route   GET /api/auth/me
// @access  private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        },
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

