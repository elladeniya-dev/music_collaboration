import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import userService from '../services/userService';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useUser();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = userId 
        ? await userService.getProfile(userId)
        : await userService.getMyProfile();
      setProfile(data);
      setFormData(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, value) => {
    const values = value.split(',').map(v => v.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updateProfile(formData);
      setProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.name || 'User Profile'}
              </h1>
              {profile.email && (
                <p className="text-gray-400">{profile.email}</p>
              )}
              {profile.userRole && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                  {profile.userRole}
                </span>
              )}
            </div>

            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Edit Profile
              </button>
            )}

            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-300 whitespace-pre-wrap">
                {profile.bio || 'No bio provided'}
              </p>
            )}
          </div>
        </div>

        {/* Musician Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Musician Profile</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Instruments */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Instruments</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.instruments?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('instruments', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="Guitar, Piano, Drums (comma separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.instruments?.map((instrument, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      {instrument}
                    </span>
                  )) || <span className="text-gray-500">No instruments listed</span>}
                </div>
              )}
            </div>

            {/* Genres */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Genres</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.genres?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('genres', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="Rock, Jazz, Classical (comma separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.genres?.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30"
                    >
                      {genre}
                    </span>
                  )) || <span className="text-gray-500">No genres listed</span>}
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Experience Level</label>
              {isEditing ? (
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select...</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="PROFESSIONAL">Professional</option>
                </select>
              ) : (
                <p className="text-white">
                  {profile.experienceLevel 
                    ? profile.experienceLevel.charAt(0) + profile.experienceLevel.slice(1).toLowerCase()
                    : 'Not specified'}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Years of Experience</label>
              {isEditing ? (
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience || ''}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <p className="text-white">{profile.yearsOfExperience || 'Not specified'}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="City, Country"
                />
              ) : (
                <p className="text-white">{profile.location || 'Not specified'}</p>
              )}
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Timezone</label>
              {isEditing ? (
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., America/New_York"
                />
              ) : (
                <p className="text-white">{profile.timezone || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Links</h2>

          <div className="space-y-4">
            {[
              { field: 'websiteUrl', label: 'Website', icon: '🌐' },
              { field: 'spotifyUrl', label: 'Spotify', icon: '🎵' },
              { field: 'youtubeUrl', label: 'YouTube', icon: '📺' },
              { field: 'soundcloudUrl', label: 'SoundCloud', icon: '☁️' },
              { field: 'instagramUrl', label: 'Instagram', icon: '📸' },
            ].map(({ field, label, icon }) => (
              <div key={field}>
                <label className="block text-gray-400 text-sm mb-2">
                  {icon} {label}
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder={`https://...`}
                  />
                ) : profile[field] ? (
                  <a
                    href={profile[field]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 break-all"
                  >
                    {profile[field]}
                  </a>
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
