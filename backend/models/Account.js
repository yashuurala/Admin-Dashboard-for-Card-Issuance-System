const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountId: String,
  accountType: String,
  accountNo: String,
  customerName: String,
  mobileNumber: String,
  emailAddress: String
});

module.exports = mongoose.model('Account', accountSchema);
