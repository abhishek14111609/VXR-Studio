const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientRole: { type: String },
  company: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  avatarUrl: { type: String },
  videoUrl: { type: String } // Optional video testimonial
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
