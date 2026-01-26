const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected'],
        default: 'Applied'
    },
    appliedDate: { type: Date, default: Date.now },
    interviews: [{
        round: String,
        date: Date,
        feedback: String
    }],
    offerDetails: {
        salary: String,
        joiningDate: Date
    },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Placement', PlacementSchema);
