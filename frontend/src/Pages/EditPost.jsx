import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const post = res.data.Blog || res.data.blog;
        if (post.author?._id !== user?.id) {
          // Redirect if not the owner
          navigate('/');
          return;
        }
        setPostContent(post.content || '');
        setTitle(post.title || '');
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchPost();
    }
  }, [id, user, navigate]);

  const handleUpdate = async () => {
    if (!postContent.trim()) return;
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', title || 'Post');
      formData.append('content', postContent);
      // Not handling image update right now as it's complex and not explicitly required

      await api.put(`/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full p-6">
        <main className="max-w-[1200px] mx-auto w-full p-8 text-center text-secondary">Loading...</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h2>
          
          <div className="flex flex-col gap-4">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
            <textarea 
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 resize-none outline-none min-h-[200px] focus:border-blue-500 focus:bg-white transition-colors"
            ></textarea>
          </div>
          
          <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100">
            <button 
              onClick={() => navigate(`/posts/${id}`)}
              className="px-6 py-2.5 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors mr-3"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              disabled={isUpdating || !postContent.trim()}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
