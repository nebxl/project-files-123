import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function BookmarkletGenerator() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  
  // Create an example proxy URL (in a real implementation, this would come from the active link)
  const proxyBaseUrl = window.location.origin;
  
  // Generate the bookmarklet code for proxying the current page
  const bookmarkletCode = `javascript:(function(){window.open('${proxyBaseUrl}/session/abc123?url='+encodeURIComponent(window.location.href),'_blank');})();`;
  
  const copyBookmarklet = (code: string, name: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast({
          title: "Copied!",
          description: `${name} bookmarklet copied to clipboard.`,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Error",
          description: "Failed to copy bookmarklet code",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access Bookmarklet</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-700 mb-4">
          Use the bookmarklet feature for quick access to websites through the proxy. Copy the code to create a bookmark:
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <button 
            onClick={() => {
              toast({
                title: "Bookmarklet Demo",
                description: "In a fully configured proxy, this would proxy the current page.",
                duration: 5000,
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center"
          >
            Proxy This Page
          </button>
          
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Instructions:</p>
            <ol className="text-sm text-gray-600 list-decimal pl-5">
              <li>Right-click your bookmarks bar and select "Add Page..."</li>
              <li>Enter "Proxy This Page" as the name</li>
              <li>Paste the code below as the URL</li>
            </ol>
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="bookmarklet-code" className="block text-sm font-medium text-gray-700 mb-1">
            Bookmarklet Code:
          </label>
          <div className="flex">
            <code 
              id="bookmarklet-code"
              className="bg-gray-100 p-2 rounded text-sm text-blue-800 flex-1 mr-2 overflow-x-auto border border-gray-200"
            >
              {bookmarkletCode}
            </code>
            <button 
              onClick={() => copyBookmarklet(bookmarkletCode, "Generic")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm transition"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-100">
          <h3 className="text-sm font-medium text-green-800 mb-2">Bookmarkly Direct Access</h3>
          <p className="text-sm text-green-700 mb-3">
            For quick access to bookmarkly.playcode.io through the proxy, use this special shortcut button:
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // In a real implementation, this would open the Bookmarkly site through the proxy
                // For now, just show a success toast message
                toast({
                  title: "Bookmarkly Link Generated",
                  description: "In a fully configured proxy, this would open Bookmarkly through the proxy server.",
                  duration: 5000,
                });
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Open Bookmarkly
            </button>
            <button
              onClick={() => {
                // Create a simplified bookmarklet code for demo purposes
                const bookmarkletCode = `javascript:(function(){alert('In a real proxy, this would open Bookmarkly through the proxy');})();`;
                copyBookmarklet(bookmarkletCode, "Bookmarkly");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm transition"
            >
              Copy Bookmarkly Code
            </button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-100">
          <h3 className="text-sm font-medium text-red-800 mb-2">YouTube Fast Lane</h3>
          <p className="text-sm text-red-700 mb-3">
            Access YouTube quickly through the proxy with this fast lane button:
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // In a real implementation, this would open YouTube through the proxy
                // For now, just show a success toast message
                toast({
                  title: "YouTube Fast Lane",
                  description: "In a fully configured proxy, this would open YouTube through the proxy server.",
                  duration: 5000,
                });
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Open YouTube
            </button>
            <button
              onClick={() => {
                // Create a simplified bookmarklet code for demo purposes
                const bookmarkletCode = `javascript:(function(){alert('In a real proxy, this would open YouTube through the proxy');})();`;
                copyBookmarklet(bookmarkletCode, "YouTube");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm transition"
            >
              Copy YouTube Code
            </button>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How it works</h3>
          <p className="text-sm text-blue-700">
            When clicked, this bookmarklet will open your current page through the Rammerhead proxy,
            allowing you to bypass restrictions. The link changes automatically when you rotate your proxy link.
          </p>
        </div>
      </div>
    </div>
  );
}