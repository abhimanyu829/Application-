const mongoose = require('mongoose');

const teamMemberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
    },
    role: {
      type: String,
      required: [true, 'Please add a role'],  
    },
    email: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    avatar: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
