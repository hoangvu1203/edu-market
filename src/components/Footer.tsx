import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-100 to-blue-50 text-secondary-800 py-6 mt-12 border-t border-secondary-200 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm">&copy; {new Date().getFullYear()} EduMarket. All rights reserved.</div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <span className="cursor-pointer hover:underline text-secondary-700">About</span>
          <span className="cursor-pointer hover:underline text-secondary-700">Contact</span>
          <span className="cursor-pointer hover:underline text-secondary-700">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 