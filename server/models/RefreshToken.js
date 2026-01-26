const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiryDate: { type: Date, required: true },
    createdByIp: { type: String },
    revoked: { type: Date }, // If populated, token is invalid
    revokedByIp: { type: String },
    replacedByToken: { type: String }
});

RefreshTokenSchema.statics.createToken = async function (user) {
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7); // 7 days expiry

    const _token = require('crypto').randomBytes(40).toString('hex');

    const _object = new this({
        token: _token,
        user: user._id,
        expiryDate: expiredAt.getTime(),
    });

    const refreshToken = await _object.save();
    return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
