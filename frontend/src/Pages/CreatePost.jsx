import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { Plus, Image as ImageIcon, Trash2 } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [postContent, setPostContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setShowAddMenu(false);
    }
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;
    
    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append('title', title || 'Untitled');
      formData.append('content', postContent);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setPostContent('');
      setTitle('');
      setSelectedImage(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const adjustTextareaHeight = (e) => {
    setPostContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white min-h-[calc(100vh-56px)]">
      {/* Top action bar */}
      <div className="w-full flex justify-end px-6 py-4 max-w-4xl mx-auto">
        <button 
          onClick={handlePost}
          disabled={isPosting || !postContent.trim()}
          className="bg-green-600 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:hover:bg-green-600"
        >
          {isPosting ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 md:px-12 pb-32 mt-4">
        {/* Title Input */}
        <div className="flex gap-4 mb-4">
          {/* Spacer for alignment with body */}
          <div className="w-8 shrink-0 hidden sm:block"></div> 
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            spellCheck="false"
            className="w-full bg-transparent border-none text-gray-900 text-4xl md:text-[42px] font-serif outline-none placeholder:text-gray-300"
          />
        </div>

        {/* Content Area */}
        <div className="relative flex gap-4">
          {/* Add Button (Medium style) */}
          <div className="relative pt-2 shrink-0 hidden sm:block">
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={`w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 hover:border-gray-800 hover:text-gray-800 transition-all duration-300 ${showAddMenu ? 'rotate-45 border-gray-800 text-gray-800' : ''}`}
            >
              <Plus className="w-5 h-5 font-light" />
            </button>
            
            {/* Popout menu */}
            {showAddMenu && (
              <div className="absolute left-12 top-1 flex gap-2 z-10 transition-all">
                <button 
                  onClick={() => fileInputRef.current.click()} 
                  className="w-9 h-9 rounded-full border border-green-500 flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors bg-white shadow-sm"
                  title="Add an image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <textarea 
              ref={textareaRef}
              value={postContent}
              onChange={adjustTextareaHeight}
              placeholder="Tell your story..."
              spellCheck="false"
              className="w-full bg-transparent border-none text-gray-700 text-xl font-serif resize-none outline-none min-h-[300px] placeholder:text-gray-300 leading-relaxed overflow-hidden py-2"
              autoFocus
            />
            
            {selectedImage && (
              <div className="relative w-fit mt-4 group">
                <img src={URL.createObjectURL(selectedImage)} alt="preview" className="max-h-[500px] rounded-md object-cover border border-gray-200" />
                <button 
                  onClick={() => setSelectedImage(null)} 
                  className="absolute top-4 right-4 bg-red-500/90 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
