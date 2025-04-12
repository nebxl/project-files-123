import React, { useState } from 'react';
import { useProxy } from '@/context/ProxyContext';
import { formatRelativeTime, copyToClipboard, openUrl } from '@/lib/rammerhead';
import { useToast } from '@/hooks/use-toast';

export default function LinkHistory() {
  const { links, settings, saveSettings } = useProxy();
  const { toast } = useToast();
  const [displayCount, setDisplayCount] = useState(3);
  
  // Get current rotation interval from settings
  const rotationInterval = settings?.rotationInterval || 60; // Default to 60 minutes
  
  const handleCopy = async (url: string) => {
    const success = await copyToClipboard(url);
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
  
  const handleOpen = (url: string) => {
    openUrl(url);
  };
  
  const handleRotationIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (!settings) return;
    
    // If "custom" is selected, would normally open a modal for custom input
    if (value === 'custom') {
      toast({
        title: 'Custom Interval',
        description: 'Custom interval configuration is not implemented in this demo.',
      });
      return;
    }
    
    // Save the new rotation interval
    saveSettings({
      ...settings,
      rotationInterval: parseInt(value),
    });
  };
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  // Get value for rotation dropdown
  const getRotationIntervalValue = () => {
    if (rotationInterval === 30) return '30';
    if (rotationInterval === 60) return '60';
    if (rotationInterval === 120) return '120';
    if (rotationInterval === 240) return '240';
    return 'custom';
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#424242]">Link History</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-[#424242]">Auto-rotating every:</span>
          <select 
            id="rotation-interval" 
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2]"
            value={getRotationIntervalValue()}
            onChange={handleRotationIntervalChange}
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="240">4 hours</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-[#424242] uppercase tracking-wider">URL</th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-[#424242] uppercase tracking-wider">Generated</th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-[#424242] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-[#424242] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.slice(0, displayCount).map((link) => (
              <tr key={link.id}>
                <td className="px-4 py-3">
                  <div className="w-64 lg:w-auto overflow-hidden overflow-ellipsis font-mono text-xs">
                    {link.url}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {formatRelativeTime(link.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {link.isActive ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-[#4CAF50] bg-opacity-10 text-[#4CAF50]">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                      Expired
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button 
                      className="p-1 hover:bg-gray-100 rounded" 
                      aria-label="Copy link"
                      onClick={() => handleCopy(link.url)}
                    >
                      <span className="material-icons text-[#424242] text-sm">content_copy</span>
                    </button>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded" 
                      aria-label="Open link"
                      onClick={() => handleOpen(link.url)}
                    >
                      <span className="material-icons text-[#424242] text-sm">open_in_new</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                  No proxy links found. Generate a new link to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {links.length > displayCount && (
        <div className="flex justify-center mt-4">
          <button 
            id="load-more-btn" 
            className="text-sm text-[#1976D2] hover:underline"
            onClick={handleLoadMore}
          >
            Load more history
          </button>
        </div>
      )}
    </div>
  );
}
