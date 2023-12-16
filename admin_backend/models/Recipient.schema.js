const mongoose = require('mongoose');

// Define Recipient Schema
const recipientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cnic: {
    type: String,
    required: true,
    unique: true
  },
  occupation: {
    type: String
  },
  income: {
    type: Number
  },
  needs: {
    type: String
  },
  isNeedFulfilled: {
    type: Boolean, 
    default: false 
  },
  phone: {
    type: String
  },
  address: {
    type: String
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
    default: 'recipient',
  },
  documents: [
    {
      path: String  
    }
  ]
});

// Create Recipient model
const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient;
