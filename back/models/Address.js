const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  ward: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  fullAddress: {
    type: String
    // Không cần required vì có thể được tạo tự động trong middleware
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Address', addressSchema);
