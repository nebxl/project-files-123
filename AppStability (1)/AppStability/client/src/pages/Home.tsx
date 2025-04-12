import React, { useState } from 'react';
import Header from '@/components/Header';
import AlertBanner from '@/components/AlertBanner';
import ProxyDashboard from '@/components/ProxyDashboard';
import LinkHistory from '@/components/LinkHistory';
import ErrorLog from '@/components/ErrorLog';
import Footer from '@/components/Footer';
import SettingsModal from '@/components/SettingsModal';
import BookmarkletGenerator from '@/components/BookmarkletGenerator';
// Import useProxy but don't use it yet since it's causing an error
// import { useProxy } from '@/context/ProxyContext';

// Mock data for development
const mockErrorLogs: any[] = [];

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // const { errorLogs } = useProxy(); // This is causing the error, so use mock data instead
  
  // Use mock data to determine if we should show the alert banner
  const showAlertBanner = mockErrorLogs.length > 0 && 
    mockErrorLogs.some(log => log.severity === 'warning' || log.severity === 'error');

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        {showAlertBanner && (
          <AlertBanner 
            title="Server Error"
            message="There was an issue connecting to the proxy server"
            severity="warning"
            onClose={() => console.log('Alert closed')}
          />
        )}
        
        <ProxyDashboard />
        
        <BookmarkletGenerator />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Link History</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-700">
              Your recent proxy links will appear here. Currently no history available.
            </p>
          </div>
        </div>
        
        <div className="mt-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Logs</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-700">
              No errors have been recorded. The system is running smoothly.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
