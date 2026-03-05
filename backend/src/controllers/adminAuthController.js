const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  // Check for admin user
  const admin = await Admin.findOne({ username, isActive: true });

  if (admin && (await admin.matchPassword(password))) {
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.status(200).json({
      _id: admin.id,
      username: admin.username,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc    Get current admin
// @route   GET /api/auth/admin/me
// @access  Private/Admin
const getAdminMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-password');
  res.status(200).json(admin);
});

// @desc    Admin logout (client-side token removal)
// @route   POST /api/auth/admin/logout
// @access  Private/Admin
const adminLogout = asyncHandler(async (req, res) => {
  // Since JWT is stateless, we just return success
  // The client should remove the token
  res.status(200).json({ message: 'Admin logged out successfully' });
});

// @desc    Create default admin (for initial setup)
// @route   POST /api/auth/admin/setup
// @access  Public (should be removed or protected after initial setup)
const createDefaultAdmin = asyncHandler(async (req, res) => {
  // Check if any admin exists
  const existingAdmin = await Admin.findOne({});
  
  if (existingAdmin) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  // Create default admin from environment variables
  const defaultAdmin = await Admin.create({
    username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
    role: 'superadmin',
  });

  res.status(201).json({
    message: 'Default admin created successfully',
    username: defaultAdmin.username,
  });
});

module.exports = {
  adminLogin,
  getAdminMe,
  adminLogout,
  createDefaultAdmin,
};