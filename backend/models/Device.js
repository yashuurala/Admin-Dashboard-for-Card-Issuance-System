const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: String,
  branchCode: String,
  location: String,
  type: String,
  uniqueId: String,
  hopperCount: Number,
  status: String
});

module.exports = mongoose.model('Device', deviceSchema);
