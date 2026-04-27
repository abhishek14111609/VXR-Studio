const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema({
    title: String,
    description: String
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
    name: String,
    role: String,
    image: String,
    bio: String
}, { _id: false });

const socialLinksSchema = new mongoose.Schema({
    instagram: String,
    facebook: String,
    threads: String,
    linkedin: String,
    youtube: String,
    twitter: String
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
    benefits: [benefitSchema],
    teamMembers: [teamMemberSchema],
    socialLinks: socialLinksSchema
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
