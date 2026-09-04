import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './SideBar';

const Layout = ({ children, defaultExpanded = true }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(defaultExpanded);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div 
        className="fixed inset-0 -z-10 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: "url('/faf22eaf-7d73-4f8b-9dc2-c60cf5387878.jpg')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
      <div className="flex flex-1 pt-14">
        <Sidebar isExpanded={isSidebarExpanded} />
        <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-60 ml-0' : 'md:ml-20 ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
