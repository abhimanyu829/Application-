const asyncHandler = require('express-async-handler');
const TeamMember = require('../models/TeamMember');

// @desc    Add new team member
// @route   POST /api/team/add-member
// @access  Private (Admin)
const addMember = asyncHandler(async (req, res) => {
  const { name, department, role, profileImage, linkedin, github, email, status } = req.body;

  if (!name || !department || !role) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const member = await TeamMember.create({
    name,
    department,
    role,
    avatar: profileImage,
    linkedin,
    github,
    email,
    status: status || 'approved',
  });

  res.status(201).json(member);
});

// @desc    Get all team members
// @route   GET /api/team/members
// @access  Public
const getMembers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  
  if (status) {
    query.status = status;
  }

  const members = await TeamMember.find(query).sort({ createdAt: -1 });
  res.status(200).json(members);
});

// @desc    Approve team member
// @route   PATCH /api/team/:id/approve
// @access  Private (Admin)
const approveMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  member.status = 'approved';
  await member.save();

  res.status(200).json(member);
});

// @desc    Reject team member
// @route   PATCH /api/team/:id/reject
// @access  Private (Admin)
const rejectMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  member.status = 'rejected';
  await member.save();

  res.status(200).json(member);
});

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private (Admin)
const updateMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  const updatedMember = await TeamMember.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedMember);
});

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private (Admin)
const deleteMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  await member.deleteOne();

  req.app.get('io').emit('team_update', { action: 'delete', id: req.params.id });
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  addMember,
  getMembers,
  updateMember,
  deleteMember,
  approveMember,
  rejectMember,
};
