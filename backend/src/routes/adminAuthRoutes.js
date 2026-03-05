const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAdminMe,
  adminLogout,
  createDefaultAdmin,
} = require('../controllers/adminAuthController');
const { adminProtect } = require('../middleware/adminAuth');

// Public routes
router.post('/login', adminLogin);
router.post('/setup', createDefaultAdmin); // Remove this after initial setup

// Protected routes
router.get('/me', adminProtect, getAdminMe);
router.post('/logout', adminProtect, adminLogout);

module.exports = router;