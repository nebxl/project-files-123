import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-[#424242] py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-sm font-medium">Rammerhead Proxy Manager v1.2.0</p>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Self-Hosted Proxy Solution</p>
          </div>
          <div className="flex items-center gap-x-6">
            <a href="#" className="text-sm text-[#424242] hover:text-blue-600 transition">Documentation</a>
            <a href="https://github.com/Ruby-Network/rammerhead-old" target="_blank" rel="noopener noreferrer" className="text-sm text-[#424242] hover:text-blue-600 transition">GitHub</a>
            <a href="#" className="text-sm text-[#424242] hover:text-blue-600 transition">Support</a>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-gray-500 hidden md:block">
            <p>Server Status: Online</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
