import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { Heart, MessageCircle } from 'lucide-react';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoadingId, setFollowLoadingId] = useState(null);
  const [likeLoadingId, setLikeLoadingId] = useState(null);

  const fetchBlogsAndUser = async () => {
    try {
      const [postsRes, userRes] = await Promise.all([
        api.get('/posts'),
        user ? api.get(`/auth/${user.id}`) : Promise.resolve({ data: { user: { following: [] } } })
      ]);
      setBlogs(postsRes.data.Blog || postsRes.data.blogs || []);
      if (userRes.data?.user?.following) {
        setFollowing(userRes.data.user.following.map(f => f._id || f));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsAndUser();
  }, [user]);

  const handleFollowToggle = async (e, authorId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    
    setFollowLoadingId(authorId);
    const isCurrentlyFollowing = following.includes(authorId);
    
    try {
      if (isCurrentlyFollowing) {
        await api.post(`/auth/unfollow/${authorId}`);
        setFollowing(prev => prev.filter(id => id !== authorId));
      } else {
        await api.post(`/auth/follow/${authorId}`);
        setFollowing(prev => [...prev, authorId]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoadingId(null);
    }
  };

  const handleLikeToggle = async (e, blogId, isLikedLocally) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    setLikeLoadingId(blogId);

    try {
      if (isLikedLocally) {
        await api.delete(`/posts/${blogId}/like`);
        setBlogs(prevBlogs => prevBlogs.map(blog => 
          blog._id === blogId 
            ? { ...blog, isLikedLocally: false, likesCount: Math.max(0, (blog.likesCount || 1) - 1) } 
            : blog
        ));
      } else {
        await api.post(`/posts/${blogId}/like`);
        setBlogs(prevBlogs => prevBlogs.map(blog => 
          blog._id === blogId 
            ? { ...blog, isLikedLocally: true, likesCount: (blog.likesCount || 0) + 1 } 
            : blog
        ));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <main className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 pb-20">
          {loading ? (
            <div className="text-center text-gray-500 py-10 text-sm">Loading feed...</div>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <div 
                key={blog._id} 
                className="bg-white border border-gray-200 rounded-sm overflow-hidden"
              >
                {/* Header: Author & Date */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${blog.author?._id}`} className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {blog.author?.profilePic ? (
                        <img src={blog.author.profilePic} alt={blog.author.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-medium text-gray-500">{blog.author?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </Link>
                    <div className="flex flex-col">
                      <Link to={`/profile/${blog.author?._id}`} className="text-sm font-medium hover:underline text-gray-900">
                        {blog.author?.name}
                      </Link>
                      <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {user && user.id !== blog.author?._id && (
                    <button 
                      onClick={(e) => handleFollowToggle(e, blog.author?._id)}
                      disabled={followLoadingId === blog.author?._id}
                      className={`px-3 py-1 text-xs font-medium border rounded-sm transition-colors ${
                        following.includes(blog.author?._id)
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'bg-black text-white border-black hover:bg-gray-800'
                      }`}
                    >
                      {followLoadingId === blog.author?._id ? '...' : following.includes(blog.author?._id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>

                {/* Content */}
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

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <button 
                      onClick={(e) => handleLikeToggle(e, blog._id, blog.isLikedLocally)}
                      disabled={likeLoadingId === blog._id}
                      className="flex items-center gap-1.5 transition-colors group"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${blog.isLikedLocally ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover:text-red-500'}`} /> 
                      <span className={`text-sm font-medium ${blog.isLikedLocally ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>
                        {blog.likesCount || 0}
                      </span>
                    </button>
                    <Link to={`/posts/${blog._id}`} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-4 h-4" /> 
                      <span className="text-sm font-medium">{blog.commentsCount || 0}</span>
                    </Link>
                    <div className="ml-auto">
                      <Link to={`/posts/${blog._id}`} className="text-sm text-blue-600 hover:underline font-medium">
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10 text-sm">No posts yet.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;