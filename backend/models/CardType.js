const mongoose = require('mongoose');

const CardTypeSchema = new mongoose.Schema({
  cardTypeId: { type: String, required: true, unique: true },
  cardTypeName: { type: String, required: true },
  serviceProvider: { type: String, required: true }
});

module.exports = mongoose.model('CardType', CardTypeSchema);
