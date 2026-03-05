const express = require('express');
const router = express.Router();
const {
  addMember,
  getMembers,
  updateMember,
  deleteMember,
  approveMember,
  rejectMember,
} = require('../controllers/teamController');
const { adminProtect } = require('../middleware/adminAuth');

// Public route to get all members
router.get('/members', getMembers);

// Admin only routes
router.post('/add-member', adminProtect, addMember);
router.put('/:id', adminProtect, updateMember);
router.delete('/:id', adminProtect, deleteMember);
router.patch('/:id/approve', adminProtect, approveMember);
router.patch('/:id/reject', adminProtect, rejectMember);

module.exports = router;
