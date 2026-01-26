const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};

// Update user profile (name, bio, preferences)
exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, learningPreferences, skillLevel } = req.body;

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (bio !== undefined) updateData.bio = bio.trim();
        if (learningPreferences) updateData.learningPreferences = learningPreferences;
        if (skillLevel) updateData.skillLevel = skillLevel;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters'
            });
        }

        // Get user with password
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ message: 'Failed to change password' });
    }
};

// Update learning preferences
exports.updatePreferences = async (req, res) => {
    try {
        const {
            dailyGoal,
            preferredTopics,
            difficulty,
            emailNotifications,
            theme
        } = req.body;

        const preferences = {};
        if (dailyGoal) preferences.dailyGoal = dailyGoal;
        if (preferredTopics) preferences.preferredTopics = preferredTopics;
        if (difficulty) preferences.difficulty = difficulty;
        if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications;
        if (theme) preferences.theme = theme;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { learningPreferences: preferences } },
            { new: true }
        ).select('-password');

        res.json({
            message: 'Preferences updated successfully',
            preferences: user.learningPreferences
        });
    } catch (err) {
        console.error('Update preferences error:', err);
        res.status(500).json({ message: 'Failed to update preferences' });
    }
};

// Get user statistics
exports.getStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('mastery strengths weaknesses lastActive');

        // Calculate total mastery
        const masteryMap = user.mastery || new Map();
        const masteryValues = Array.from(masteryMap.values());
        const avgMastery = masteryValues.length > 0
            ? Math.round(masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length)
            : 0;

        res.json({
            totalMastery: avgMastery,
            topicsLearned: masteryMap.size,
            strengths: user.strengths || [],
            weaknesses: user.weaknesses || [],
            lastActive: user.lastActive
        });
    } catch (err) {
        console.error('Get stats error:', err);
        res.status(500).json({ message: 'Failed to fetch statistics' });
    }
};

// Delete account (soft delete or hard delete)
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password confirmation required' });
        }

        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Hard delete (or implement soft delete with isDeleted flag)
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete account error:', err);
        res.status(500).json({ message: 'Failed to delete account' });
    }
};
