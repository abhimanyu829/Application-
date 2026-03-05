const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Update user data
// @route   PATCH /api/auth/me
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields if present in request body
  if (req.body.terms_accepted !== undefined) user.terms_accepted = req.body.terms_accepted;
  if (req.body.privacy_accepted !== undefined) user.privacy_accepted = req.body.privacy_accepted;
  if (req.body.policy_version !== undefined) user.policy_version = req.body.policy_version;
  if (req.body.accepted_at !== undefined) user.accepted_at = req.body.accepted_at;

  // Can extend for other fields like name, etc. if needed
  if (req.body.name) user.name = req.body.name;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    terms_accepted: updatedUser.terms_accepted,
    privacy_accepted: updatedUser.privacy_accepted,
    policy_version: updatedUser.policy_version,
    token: generateToken(updatedUser._id),
  });
});

// @desc    Google Auth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {

  console.log("Google login request body:", req.body);
  const { idToken, isAccessToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error('No token provided');
  }

  try {
    let name, email, googleId, picture;

    if (isAccessToken) {
      // Verify Access Token using Google UserInfo API
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      if (!response.ok) {
        throw new Error('Failed to verify access token');
      }

      const payload = await response.json();
      name = payload.name;
      email = payload.email;
      googleId = payload.sub;
      picture = payload.picture;
    } else {
      // Verify ID Token
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      name = payload.name;
      email = payload.email;
      googleId = payload.sub;
      picture = payload.picture;
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update googleId and avatar if they are missing or changed
      user.googleId = googleId;
      user.avatar = picture || user.avatar;
      await user.save();
    } else {
      // Create new user
      // Password is not required for Google users as per schema
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        password: '', // Empty password for Google users
      });
    }

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      picture: user.avatar, // For backward compatibility
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401);
    throw new Error('Google authentication failed');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  googleAuth,
};
