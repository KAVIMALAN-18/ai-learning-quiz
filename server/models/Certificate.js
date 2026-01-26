const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseName: { type: String, required: true },
    userName: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number },
    issueDate: { type: Date, default: Date.now },
    verificationId: { type: String, required: true, unique: true },
    certificateUrl: { type: String }, // Optional: Path to generated PDF
    qrCodeData: { type: String } // Data for QR code generation
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
