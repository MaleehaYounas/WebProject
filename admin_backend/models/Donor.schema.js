const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  religion: {
    type: String
  },
  profilePicture: {
    type: String  
  },
  isBlocked: {
     type: Boolean, 
     default: false 
  },
  role: {
    type: String,
    default: 'donor',
  },
  donationHistory: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
 
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
