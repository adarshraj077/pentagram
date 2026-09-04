import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editProfilePic, setEditProfilePic] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const [profileRes, blogsRes] = await Promise.all([
        api.get(`/auth/${id}`),
        api.get(`/posts/user/${id}`)
      ]);
      setProfileData(profileRes.data.user);
      setBlogs(blogsRes.data.blogs || blogsRes.data.Blog || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    if (!user) return;
    setFollowLoading(true);
    const isFollowing = profileData.followers.some(f => f._id === user.id);
    
    try {
      if (isFollowing) {
        await api.post(`/auth/unfollow/${id}`);
      } else {
        await api.post(`/auth/follow/${id}`);
      }
      fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditName(profileData.name);
    setEditBio(profileData.bio || '');
    setEditProfilePic(null);
    setIsEditing(true);
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('bio', editBio);
      if (editProfilePic) {
        formData.append('profilePic', editProfilePic);
      }
      const res = await api.post('/auth/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileData(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">Loading...</div>;
  if (!profileData) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">User not found</div>;

  const isOwnProfile = user?.id === profileData._id;
  const isFollowing = profileData.followers.some(f => f._id === user?.id);

  return (
    <div className="flex flex-col w-full h-full">
      <main className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 pb-20">
          
          {/* Header Profile Section */}
          <div className="bg-white border border-gray-200 p-8 flex flex-col items-center text-center rounded-sm">
            {isEditing ? (
              <div className="w-full max-w-md mx-auto flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-4 border border-gray-200 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {editProfilePic ? (
                    <img src={URL.createObjectURL(editProfilePic)} alt="preview" className="w-full h-full object-cover" />
                  ) : profileData.profilePic ? (
                    <img src={profileData.profilePic} alt={profileData.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-gray-500">{profileData.name.charAt(0).toUpperCase()}</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setEditProfilePic(e.target.files[0])} className="hidden" />
                </div>
                
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  placeholder="Your Name"
                  className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 text-center text-xl font-bold text-gray-900"
                />
                
                <textarea 
                  value={editBio} 
                  onChange={(e) => setEditBio(e.target.value)} 
                  placeholder="Tell us about yourself..."
                  className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 text-center text-sm text-gray-600 resize-none h-20"
                />
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateProfile} 
                    disabled={isUpdating}
                    className="px-4 py-1.5 bg-black text-white rounded-sm hover:bg-gray-800 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-4 border border-gray-200">
                  {profileData.profilePic ? (
                    <img src={profileData.profilePic} alt={profileData.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-gray-500">{profileData.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                
                <h1 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 whitespace-pre-wrap">{profileData.bio || 'No bio available.'}</p>
                
                <div className="flex items-center justify-center gap-8 mb-6 text-sm">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-900">{profileData.followers.length}</span>
                    <span className="text-gray-500">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-900">{profileData.following.length}</span>
                    <span className="text-gray-500">Following</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isOwnProfile ? (
                    <button onClick={handleEditClick} className="bg-gray-100 text-gray-900 px-4 py-1.5 border border-gray-200 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors">
                      Edit Profile
                    </button>
                  ) : (
                    <button 
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`px-6 py-1.5 rounded-sm text-sm font-medium transition-colors border ${
                        isFollowing 
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                          : 'bg-black text-white border-black hover:bg-gray-800'
                      }`}
                    >
                      {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Posts List */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">Posts</h3>
            <div className="flex flex-col gap-6">
              {blogs.map(blog => (
                <div key={blog._id} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="p-4">
                    {blog.title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>}
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                      {blog.content?.length > 300 ? blog.content.substring(0, 300) + '...' : blog.content}
                    </p>
                    
                    {blog.image && (
                      <div className="w-full rounded-sm overflow-hidden mb-4 border border-gray-100">
                         <img src={blog.image} alt={blog.title || 'Post image'} className="w-full max-h-[500px] object-cover" loading="lazy" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <Link to={`/posts/${blog._id}`} className="text-sm text-blue-600 hover:underline font-medium">
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-sm">
                  No posts yet.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
