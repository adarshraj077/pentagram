import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import api, { API_URL } from '../api';
import { AuthContext } from '../AuthContext';
import { io } from 'socket.io-client';
import { Send, Mail } from 'lucide-react';

const MessagesPage = () => {
  const { user } = useContext(AuthContext);
  const [following, setFollowing] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get(`/auth/${user.id}`);
        setFollowing(res.data.user.following || []);
      } catch (err) {
        console.error('Failed to fetch following contacts:', err);
      } finally {
        setLoadingContacts(false);
      }
    };
    if (user) {
      fetchContacts();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const socketUrl = API_URL.startsWith('/')
        ? window.location.origin
        : API_URL.replace(/\/api\/?$/, '');
      socketRef.current = io(socketUrl, {
        query: { userId: user.id }
      });

      socketRef.current.on('newMessage', (message) => {
        setActiveChat((currentChat) => {
          if (currentChat && (message.sender === currentChat._id || message.receiver === currentChat._id)) {
            setMessages((prev) => [...prev, message]);
          }
          return currentChat;
        });
      });
    }

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      setLoadingMessages(true);
      try {
        const res = await api.get(`/message/${activeChat._id}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const text = newMessage;
    setNewMessage('');
    
    try {
      const res = await api.post(`/message/send/${activeChat._id}`, { text });
      setMessages((prev) => [...prev, res.data.message]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-6">
      <div className="flex bg-white border border-gray-200 rounded-lg h-[calc(100vh-100px)] min-h-[500px] w-full max-w-5xl mx-auto shadow-sm">
          {/* Contacts Sidebar */}
          <div className="w-[280px] border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {loadingContacts ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
              ) : following.length > 0 ? (
                following.map((contact) => (
                  <div 
                    key={contact._id} 
                    onClick={() => setActiveChat(contact)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${activeChat?._id === contact._id ? 'bg-white border-l-4 border-l-blue-600 pl-3' : 'hover:bg-white border-l-4 border-l-transparent'}`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center font-semibold shrink-0 text-sm border border-gray-300">
                      {contact.profilePic ? (
                         <img src={contact.profilePic} alt={contact.name} className="w-full h-full object-cover" />
                      ) : (
                         contact.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate text-sm">{contact.name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center text-sm">
                  <p className="mb-4">You aren't following anyone yet.</p>
                  <Link to="/" className="text-blue-600 hover:underline font-medium">Find people</Link>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col relative bg-white min-w-0">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center font-semibold shrink-0 text-xs border border-gray-300">
                    {activeChat.profilePic ? (
                       <img src={activeChat.profilePic} alt={activeChat.name} className="w-full h-full object-cover" />
                    ) : (
                       activeChat.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <Link to={`/profile/${activeChat._id}`} className="font-semibold text-gray-900 text-base hover:underline">
                    {activeChat.name}
                  </Link>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50/50">
                  {loadingMessages ? (
                    <div className="text-center text-gray-500 py-4 text-sm">Loading...</div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => {
                      const isMe = msg.sender === user.id;
                      return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-l-xl rounded-tr-xl' : 'bg-white border border-gray-200 text-gray-900 rounded-r-xl rounded-tl-xl'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-100 text-right' : 'text-gray-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full text-sm">
                      <p>Start a conversation with {activeChat.name}</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-900 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 shrink-0"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Mail className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm font-medium">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default MessagesPage;
