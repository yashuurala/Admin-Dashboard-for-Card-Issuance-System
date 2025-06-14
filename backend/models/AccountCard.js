const mongoose = require('mongoose');

const AccountCardSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  cardTypeId: { type: String, required: true },
  maskedCardNumber: { type: String, required: true },
  issuedDate: { type: String, required: true },
  expiryDate: { type: String, required: true }
});

module.exports = mongoose.model('AccountCard', AccountCardSchema);
