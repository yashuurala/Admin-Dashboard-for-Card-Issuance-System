const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchCode: String,
  branchName: String
});

module.exports = mongoose.model('Branch', branchSchema);
