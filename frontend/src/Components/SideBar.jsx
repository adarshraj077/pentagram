import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { Home, MessageCircle, User, PlusSquare } from 'lucide-react';

const Sidebar = ({ isExpanded }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-[22px] h-[22px]" /> },
    { name: 'Messages', path: '/messages', icon: <MessageCircle className="w-[22px] h-[22px]" /> },
    { name: 'Profile', path: user ? `/profile/${user.id}` : '/login', icon: <User className="w-[22px] h-[22px]" /> },
  ];

  return (
    <aside 
      className={`fixed left-0 top-14 h-[calc(100vh-56px)] bg-white border-r border-gray-200 transition-all duration-300 z-40 hidden md:flex flex-col overflow-hidden ${
        isExpanded ? 'w-60' : 'w-20'
      }`}
    >
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={!isExpanded ? item.name : undefined}
            className={({ isActive }) => 
              `flex items-center ${isExpanded ? 'px-4 gap-5' : 'justify-center px-0 flex-col gap-1'} py-3 transition-colors rounded-xl ${
                isActive 
                  ? 'bg-gray-100 text-gray-900 font-semibold' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            <div className="shrink-0">{item.icon}</div>
            {isExpanded ? (
              <span className="text-[15px] truncate">{item.name}</span>
            ) : (
              <span className="text-[10px] truncate w-full text-center">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Action Button */}
      <div className={`mt-6 px-3 ${!isExpanded ? 'flex justify-center' : ''}`}>
        <button 
          onClick={() => navigate('/posts/new')} 
          title={!isExpanded ? "Create Post" : undefined}
          className={`flex items-center justify-center text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors ${
            isExpanded ? 'w-full py-2.5 text-sm font-medium gap-2' : 'w-12 h-12 rounded-full'
          }`}
        >
          <PlusSquare className={isExpanded ? "w-5 h-5" : "w-[22px] h-[22px]"} />
          {isExpanded && <span>Create Post</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;