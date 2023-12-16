const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
email: {
        type: String,
        required: true,
        unique: true,
},
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  cnic: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String  
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
