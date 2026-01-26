const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    website: { type: String },
    logo: { type: String }, // URL to logo image
    location: { type: String },
    industry: { type: String },
    verified: { type: Boolean, default: false }, // Admin verification status
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
