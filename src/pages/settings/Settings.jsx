import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api.client';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { User, Lock, Bell, Palette, Trash2 } from 'lucide-react';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Profile state
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: ''
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Preferences state
    const [preferences, setPreferences] = useState({
        dailyGoal: 30,
        preferredTopics: [],
        difficulty: 'intermediate',
        emailNotifications: true,
        theme: 'light'
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || ''
            });
            setPreferences(user.learningPreferences || preferences);
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await api.put('/profile', profileData);
            updateUser(res.data.user);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await api.put('/profile/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handlePreferencesUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.put('/profile/preferences', preferences);
            setMessage('Preferences updated successfully!');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'preferences', label: 'Preferences', icon: Bell }
    ];

    return (
        <Container className="py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
                <p className="text-slate-500 mb-8">Manage your account settings and preferences</p>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <Card className="p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </Card>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <Card className="p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? 'Changing...' : 'Change Password'}
                            </Button>
                        </form>
                    </Card>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <Card className="p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Learning Preferences</h2>
                        <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Daily Goal (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={preferences.dailyGoal}
                                    onChange={(e) => setPreferences({ ...preferences, dailyGoal: parseInt(e.target.value) })}
                                    min="10"
                                    max="240"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Default Difficulty</label>
                                <select
                                    value={preferences.difficulty}
                                    onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Email Notifications</label>
                                    <p className="text-xs text-slate-500">Receive updates about your progress</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.emailNotifications ? 'bg-primary-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Preferences'}
                            </Button>
                        </form>
                    </Card>
                )}
            </div>
        </Container>
    );
};

export default Settings;
