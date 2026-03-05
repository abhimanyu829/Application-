const Admin = require('../models/Admin');

const setupDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne({});
    
    if (existingAdmin) {
      console.log('Admin already exists, skipping setup');
      return;
    }

    // Create default admin
    const defaultAdmin = await Admin.create({
      username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
      role: 'superadmin',
    });

    console.log('Default admin created successfully');
    console.log('Username:', defaultAdmin.username);
    console.log('Please change the default password after first login');
  } catch (error) {
    console.error('Error setting up default admin:', error);
  }
};

module.exports = { setupDefaultAdmin };