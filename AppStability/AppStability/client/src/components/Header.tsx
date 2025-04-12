import React from 'react';
// import { useProxy } from '@/context/ProxyContext';

interface HeaderProps {
  onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  // Using mock data temporarily
  const serverStatus = 'online';
  
  // Set status indicator based on server status
  const statusColor = serverStatus === 'online' ? 'bg-[#4CAF50]' : 
                      serverStatus === 'offline' ? 'bg-[#F44336]' : 'bg-[#FFC107]';
  
  const statusText = serverStatus === 'online' ? 'Server Online' : 
                     serverStatus === 'offline' ? 'Server Offline' : 'Connecting...';
  
  return (
    <header className="bg-[#1976D2] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-medium">Rammerhead Proxy Manager</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div id="server-status" className="flex items-center">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor} mr-2 animate-pulse`}></span>
            <span className="text-sm">{statusText}</span>
          </div>
          <button 
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
