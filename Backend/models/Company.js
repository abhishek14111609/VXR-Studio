const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema({
    title: String,
    description: String
}, { _id: false });

const companySchema = new mongoose.Schema({
    companyName: { type: String, default: 'VXR Media House' },
    tagline: String,
    mission: String,
    vision: String,
    phone: String,
    email: String,
    whatsapp: String,
    address: String,
    location: String,
    benefits: [benefitSchema]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
