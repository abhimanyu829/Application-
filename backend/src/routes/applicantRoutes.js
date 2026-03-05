const express = require('express');
const router = express.Router();
const {
  createApplicant,
  getMyApplicant,
  getApplicants,
  updateApplicantStatus,
} = require('../controllers/applicantController');
const { protect } = require('../middleware/auth');
const { adminProtect } = require('../middleware/adminAuth');

router.post('/', protect, createApplicant);
router.get('/my', protect, getMyApplicant);
router.get('/', adminProtect, getApplicants);
router.patch('/:id/status', adminProtect, updateApplicantStatus);

module.exports = router;
