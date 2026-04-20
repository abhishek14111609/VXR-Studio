const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  text: String
}, { _id: false });

const tierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, default: '/month' },
  features: [featureSchema],
  highlight: { type: Boolean, default: false }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  serviceTitle: { type: String, required: true },
  description: { type: String },
  highlights: [String],
  tiers: [tierSchema],
  icon: { type: String, default: 'Zap' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
