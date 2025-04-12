import React from 'react';
import { useProxy } from '@/context/ProxyContext';
import { formatTimeRemaining, copyToClipboard, openUrl } from '@/lib/rammerhead';
import { useToast } from '@/hooks/use-toast';

export default function ProxyActiveLink() {
  const { activeLink, rotateLink, testConnection, isRotating, isTesting } = useProxy();
  const { toast } = useToast();
  
  const handleCopy = async () => {
    if (!activeLink) return;
    
    const success = await copyToClipboard(activeLink.url);
    if (success) {
      toast({
        title: 'URL Copied',
        description: 'The proxy URL has been copied to clipboard.'
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy URL to clipboard.',
        variant: 'destructive'
      });
    }
  };
  
  const handleOpen = () => {
    if (!activeLink) return;
    openUrl(activeLink.url);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#424242]">Active Proxy Link</h2>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-[#4CAF50] bg-opacity-10 text-[#4CAF50] text-xs font-medium rounded-full flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50] mr-1.5"></span>
            {activeLink ? 'Active' : 'Inactive'}
          </span>
          {activeLink && activeLink.expiresAt && (
            <span className="text-xs text-[#424242]">
              Rotates in: {formatTimeRemaining(activeLink.expiresAt)}
            </span>
          )}
        </div>
      </div>
      
      <div className="bg-[#424242] bg-opacity-5 rounded-lg p-4 mb-4 relative">
        <pre className="font-mono text-sm break-all whitespace-pre-wrap" id="proxy-url">
          {activeLink ? activeLink.url : 'No active proxy link. Generate one below.'}
        </pre>
        <div className="absolute top-3 right-3 flex space-x-2">
          <button 
            className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50 transition"
            id="copy-btn" 
            aria-label="Copy link"
            onClick={handleCopy}
            disabled={!activeLink}
          >
            <span className="material-icons text-[#424242] text-sm">content_copy</span>
          </button>
          <button 
            className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50 transition"
            id="open-btn" 
            aria-label="Open link"
            onClick={handleOpen}
            disabled={!activeLink}
          >
            <span className="material-icons text-[#424242] text-sm">open_in_new</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button 
          id="refresh-link-btn" 
          className="flex items-center justify-center px-4 py-2 bg-[#1976D2] text-white rounded-md shadow-sm hover:bg-blue-700 transition"
          onClick={rotateLink}
          disabled={isRotating}
        >
          <span className={`material-icons text-sm mr-1.5 ${isRotating ? 'animate-spin' : ''}`}>refresh</span>
          {isRotating ? 'Rotating...' : 'Rotate Link Now'}
        </button>
        <button 
          id="test-link-btn" 
          className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-[#424242] rounded-md shadow-sm hover:bg-gray-50 transition"
          onClick={testConnection}
          disabled={isTesting || !activeLink}
        >
          <span className={`material-icons text-sm mr-1.5 ${isTesting ? 'animate-spin' : ''}`}>
            {isTesting ? 'refresh' : 'speed'}
          </span>
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
}
