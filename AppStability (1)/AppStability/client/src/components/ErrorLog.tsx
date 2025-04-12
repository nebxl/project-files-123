import React from 'react';
import { useProxy } from '@/context/ProxyContext';
import { formatRelativeTime } from '@/lib/rammerhead';

export default function ErrorLog() {
  const { errorLogs, clearErrorLogs } = useProxy();
  
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#424242]">Error Log</h2>
        <button 
          id="clear-errors-btn" 
          className="text-sm text-[#424242] hover:text-[#1976D2] transition"
          onClick={clearErrorLogs}
          disabled={errorLogs.length === 0}
        >
          Clear all
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {errorLogs.map((error) => (
          <div key={error.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start">
              <span className={`material-icons ${
                error.severity === 'error' ? 'text-[#F44336]' : 
                error.severity === 'warning' ? 'text-[#FFC107]' : 'text-[#2196F3]'
              } mr-3 mt-0.5`}>
                {error.severity === 'error' ? 'error_outline' : 
                 error.severity === 'warning' ? 'warning' : 'info'}
              </span>
              <div>
                <h4 className="font-medium text-[#424242]">{error.title}</h4>
                <p className="text-sm text-[#424242] mt-1">{error.message}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span>{formatRelativeTime(error.createdAt)}</span>
                  {error.code && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{error.code}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {errorLogs.length === 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <span className="material-icons text-[#4CAF50] text-4xl">check_circle</span>
          <p className="mt-2 text-[#424242]">No errors to display</p>
        </div>
      )}
    </div>
  );
}
