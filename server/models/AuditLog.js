const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g. "USER_LOGIN", "ADMIN_BAN_USER"
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who performed the action
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who was affected (optional)
    details: { type: Object }, // Metadata (e.g. "Banned for spam")
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now }
});

// Index for fast Admin Dashboard lookups
AuditLogSchema.index({ actorId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
