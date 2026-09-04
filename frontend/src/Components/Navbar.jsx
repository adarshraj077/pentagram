import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get('/user/logout');
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="text-lg font-semibold text-gray-900 tracking-tight">
          Pentagram
        </Link>
      </div>
        
      <div className="ml-auto flex items-center gap-6 text-sm font-medium">
        {user ? (
          <>
            <Link to={`/profile/${user.id}`} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:ring-2 hover:ring-gray-300 transition-all overflow-hidden border border-gray-300">
              <span className="font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
            </Link>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 transition-colors">
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-black text-white px-4 py-1.5 rounded-sm hover:bg-gray-800 transition-colors">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;