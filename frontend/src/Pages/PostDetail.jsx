import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setBlog(res.data.blog);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/posts/${id}/comments`, { text: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/posts/${id}/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">Loading...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">Post not found</div>;

  return (
    <div className="flex flex-col w-full h-full">
      <main className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col pb-20">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
               <Link to={`/profile/${blog.author?._id}`} className="w-10 h-10 rounded-sm bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                {blog.author?.profilePic ? (
                  <img src={blog.author.profilePic} alt={blog.author.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-gray-500">{blog.author?.name?.charAt(0).toUpperCase()}</span>
                )}
              </Link>
              <div className="flex flex-col">
                <Link to={`/profile/${blog.author?._id}`} className="font-semibold hover:underline text-gray-900">
                  {blog.author?.name}
                </Link>
                <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {blog.title && <h1 className="text-3xl font-bold mb-6 text-gray-900 leading-tight">{blog.title}</h1>}
            
            {blog.image && (
              <div className="mb-8 w-full rounded-sm overflow-hidden border border-gray-100 bg-gray-50">
                <img src={blog.image} alt={blog.title} className="w-full h-auto object-cover max-h-[600px]" />
              </div>
            )}
            
            <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 bg-white border border-gray-200 rounded-sm p-6 md:p-8">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Comments ({comments.length})</h3>
            
            {user ? (
              <form onSubmit={handleAddComment} className="flex gap-3 mb-8 pb-8 border-b border-gray-100">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
                />
                <button type="submit" disabled={!newComment.trim()} className="bg-black text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                  Post
                </button>
              </form>
            ) : (
               <div className="mb-8 pb-8 border-b border-gray-100 text-sm text-gray-500">
                 <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> to add a comment.
               </div>
            )}

            <div className="flex flex-col gap-6">
              {comments.length > 0 ? comments.map(comment => (
                <div key={comment._id} className="flex gap-4">
                  <Link to={`/profile/${comment.user?._id}`} className="w-8 h-8 rounded-sm overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center font-medium text-xs border border-gray-200">
                    {comment.user?.profilePic ? (
                      <img src={comment.user.profilePic} alt={comment.user.name} className="w-full h-full object-cover" />
                    ) : (
                      comment.user?.name?.charAt(0).toUpperCase()
                    )}
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/profile/${comment.user?._id}`} className="font-semibold text-sm hover:underline text-gray-900">
                        {comment.user?.name}
                      </Link>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{comment.text}</p>
                    {user && user.id === comment.user?._id && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-xs font-medium text-red-600 hover:text-red-700">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
