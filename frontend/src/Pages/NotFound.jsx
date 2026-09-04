import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <main className="w-full flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-gray-500 text-xl">Page not found</p>
          <Link to="/" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-sm hover:opacity-90 transition-opacity">
            Go Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
