import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  LogOut, Clock, Star, BookOpen, Pencil, Camera, Check,
  Target, Trophy, Bookmark, Settings, X, Save
} from 'lucide-react';

const dummyProgress = [
  { name: 'Sorting', completed: 8 },
  { name: 'Tree', completed: 5 },
  { name: 'Graph', completed: 3 },
  { name: 'DP', completed: 6 },
  { name: 'Queue', completed: 4 },
];

const Profile = () => {
  const email = localStorage.getItem('email');
  const storedName = localStorage.getItem('first_name') || 'User';
  const storedPhoto = localStorage.getItem('profile_photo');

  const [firstName, setFirstName] = useState(storedName);
  const [tagline, setTagline] = useState('Aspiring DSA Master 🌟');
  const [profilePhoto, setProfilePhoto] = useState(storedPhoto || 'https://i.pravatar.cc/100?u=r');
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(firstName);
  const [tempTagline, setTempTagline] = useState(tagline);
  const [tempPhoto, setTempPhoto] = useState(profilePhoto);
  
  const fileInputRef = useRef(null);
  const joinDate = '2024-12-15';

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!email) return;
      try {
        const res = await axios.get(`https://dsa-algorithm-manager.onrender.com/userinfo?email=${email}`);
        const data = res.data;
        setFirstName(data.first_name);
        setProfilePhoto(data.profile_photo);
        setTempName(data.first_name);
        setTempPhoto(data.profile_photo);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('profile_photo', data.profile_photo);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };
    fetchUserInfo();
  }, [email]);

  const handleSave = async () => {
    try {
      // Save name
      localStorage.setItem('first_name', tempName);
      setFirstName(tempName);
      window.dispatchEvent(new Event('first_name_updated'));

      // Save tagline
      setTagline(tempTagline);

      // Save photo if changed
      if (tempPhoto !== profilePhoto) {
        setProfilePhoto(tempPhoto);
      }

      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const handleCancel = () => {
    setTempName(firstName);
    setTempTagline(tagline);
    setTempPhoto(profilePhoto);
    setIsEditing(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !email) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    try {
      const res = await axios.post('https://dsa-algorithm-manager.onrender.com/upload-profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.status === 'success') {
        setTempPhoto(res.data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-gray-700/50 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div 
                  className="relative cursor-pointer rounded-full"
                  onClick={() => isEditing && fileInputRef.current.click()}
                >
                  <img
                    src={isEditing ? tempPhoto : profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-cyan-500 shadow-lg object-cover transform transition-transform duration-300 hover:scale-105"
                    title={isEditing ? "Click to change photo" : ""}
                  />
                  {isEditing && (
                    <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-white mx-auto mb-1" />
                        <span className="text-white text-sm font-medium">Change Photo</span>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {isEditing && (
                  <p className="text-xs text-gray-400 text-center mt-2">Click to upload new photo</p>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Name</label>
                    <input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full bg-gray-700/50 px-4 py-2 rounded-lg text-white border border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Tagline</label>
                    <input
                      value={tempTagline}
                      onChange={(e) => setTempTagline(e.target.value)}
                      className="w-full bg-gray-700/50 px-4 py-2 rounded-lg text-white border border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{firstName}</h2>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                      title="Edit Profile"
                    >
                      <Pencil className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4 flex items-center justify-center md:justify-start">
                    <Clock className="w-4 h-4 mr-2" /> Joined on {joinDate}
                  </p>

                  <p className="text-gray-300 text-lg">{tagline}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl transform transition-transform duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-cyan-400" />
              Study Progress
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dummyProgress}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
                <Bar 
                  dataKey="completed" 
                  fill="url(#colorGradient)" 
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl transform transition-transform duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Quick Stats
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                <Clock className="w-6 h-6 mr-3 text-cyan-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Time Spent</p>
                  <p className="text-xl font-semibold">12 hrs</p>
                </div>
              </li>
              <li className="flex items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                <Star className="w-6 h-6 mr-3 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Problems Completed</p>
                  <p className="text-xl font-semibold">26</p>
                </div>
              </li>
              <li className="flex items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                <BookOpen className="w-6 h-6 mr-3 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Bookmarked</p>
                  <p className="text-xl font-semibold">8</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bookmarks */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl mb-10 transform transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Bookmark className="w-5 h-5 mr-2 text-purple-400" />
            Bookmarked Algorithms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Quick Sort', 'Binary Search Tree Traversal', 'Dijkstra\'s Algorithm', 'Topological Sort'].map((algo, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <p className="text-gray-300">{algo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl mb-10 transform transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Your Goals
          </h3>
          <div className="space-y-4">
            {[
              { text: 'Solve 3 problems daily', status: 'completed' },
              { text: 'Finish Binary Tree section by next week', status: 'completed' },
              { text: 'Review sorting algorithms again', status: 'pending' }
            ].map((goal, index) => (
              <div 
                key={index}
                className="flex items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors"
              >
                <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                  goal.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                }`}>
                  {goal.status === 'completed' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <p className="text-gray-300">{goal.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl transform transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
              <span className="text-gray-300">Dark Mode</span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
              <span className="text-gray-300">Email Notifications</span>
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">Disabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
