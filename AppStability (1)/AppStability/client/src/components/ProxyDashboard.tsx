import React, { useState } from 'react';
import ProxyActiveLink from './ProxyActiveLink';
import ServerStats from './ServerStats';
import { useToast } from '@/hooks/use-toast';
// import { useProxy } from '@/context/ProxyContext';

export default function ProxyDashboard() {
  const { toast } = useToast();
  const [isRotating, setIsRotating] = useState(false);
  
  // Use mock data instead of context
  const mockServerStats = {
    uptime: 99.5,
    cpuLoad: 35,
    memoryUsage: 42,
    requestsPerMinute: 120,
    lastUpdated: new Date().toISOString()
  };
  
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Active Link Card */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Active Proxy Link</h2>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-gray-700 mb-2">Your active proxy link is:</p>
          <div className="flex items-center justify-between">
            <code className="bg-white p-2 rounded text-sm text-blue-800 flex-1 mr-2 overflow-x-auto">
              https://example.com/proxy/session/abc123
            </code>
            <button 
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
              onClick={() => {
                const linkText = "https://example.com/proxy/session/abc123";
                navigator.clipboard.writeText(linkText)
                  .then(() => {
                    toast({
                      title: "Copied!",
                      description: "Link copied to clipboard",
                    });
                  })
                  .catch(err => {
                    console.error('Failed to copy: ', err);
                    toast({
                      title: "Error",
                      description: "Failed to copy link to clipboard",
                      variant: "destructive",
                    });
                  });
              }}
            >
              Copy
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button 
              className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition"
              onClick={() => {
                const linkText = "https://example.com/proxy/session/abc123";
                window.open(linkText, '_blank');
              }}
            >
              Open Link
            </button>
            <button 
              className={`${isRotating ? 'bg-amber-400' : 'bg-amber-500'} text-white px-3 py-2 rounded-md text-sm hover:bg-amber-600 transition flex items-center justify-center`}
              onClick={async () => {
                if (isRotating) return;
                
                setIsRotating(true);
                try {
                  const response = await fetch('/api/proxy/links', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  if (!response.ok) {
                    throw new Error('Failed to rotate link');
                  }
                  
                  const newLink = await response.json();
                  
                  // Update UI with success message
                  toast({
                    title: "Success!",
                    description: `New link generated: ${newLink.url.substring(0, 35)}...`,
                  });
                  
                  // In a real implementation, we would update the UI with the new link
                  // and refresh the data using React Query's invalidateQueries
                  setTimeout(() => {
                    // Simulate UI update with the new link (would be automatic with React Query)
                    const codeElement = document.querySelector('code');
                    if (codeElement) {
                      codeElement.textContent = newLink.url;
                    }
                  }, 500);
                  
                } catch (error) {
                  console.error('Error rotating link:', error);
                  toast({
                    title: "Error",
                    description: "Failed to rotate link. Please try again.",
                    variant: "destructive",
                  });
                } finally {
                  setIsRotating(false);
                }
              }}
              disabled={isRotating}
            >
              {isRotating ? 'Rotating...' : 'Rotate Link'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Server Stats Card */}
      <ServerStats stats={mockServerStats} />
    </div>
  );
}
