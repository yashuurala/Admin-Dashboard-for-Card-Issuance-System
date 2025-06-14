const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  refNumber: String,
  accountId: String,
  type: String,
  cardTypeId: String,
  refCardId: String,
  generationDeviceId: String,
  generationTime: String,
  printDeviceId: String,
  printStatus: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
