import React, { useState, useEffect } from 'react';
// import { useProxy } from '@/context/ProxyContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Mock settings data instead of using useProxy
  const mockSettings = {
    id: 1,
    serverUrl: 'http://localhost:5000',
    rotationInterval: 60,
    enableUrlEncryption: true,
    clearCookiesOnSessionEnd: true,
    errorNotifications: true,
    linkRotationNotifications: true
  };
  
  // Form state
  const [serverUrl, setServerUrl] = useState('http://localhost:5000');
  const [rotationInterval, setRotationInterval] = useState(60);
  const [rotationUnit, setRotationUnit] = useState<'minutes' | 'hours'>('minutes');
  const [enableUrlEncryption, setEnableUrlEncryption] = useState(true);
  const [clearCookies, setClearCookies] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState(true);
  const [linkRotationNotifications, setLinkRotationNotifications] = useState(true);
  
  // Initialize form with mock settings
  useEffect(() => {
    setServerUrl(mockSettings.serverUrl);
    
    // Handle rotation interval and unit
    if (mockSettings.rotationInterval >= 60 && mockSettings.rotationInterval % 60 === 0) {
      setRotationInterval(mockSettings.rotationInterval / 60);
      setRotationUnit('hours');
    } else {
      setRotationInterval(mockSettings.rotationInterval);
      setRotationUnit('minutes');
    }
    
    setEnableUrlEncryption(mockSettings.enableUrlEncryption);
    setClearCookies(mockSettings.clearCookiesOnSessionEnd);
    setErrorNotifications(mockSettings.errorNotifications);
    setLinkRotationNotifications(mockSettings.linkRotationNotifications);
  }, [isOpen]);
  
  const handleSave = () => {
    // Mock save function
    console.log('Saving settings:', {
      serverUrl,
      rotationInterval: rotationUnit === 'hours' ? rotationInterval * 60 : rotationInterval,
      enableUrlEncryption,
      clearCookiesOnSessionEnd: clearCookies,
      errorNotifications,
      linkRotationNotifications
    });
    
    onClose();
  };
  
  const handleReset = () => {
    // Reset to default values
    setServerUrl('http://localhost:5000');
    setRotationInterval(1);
    setRotationUnit('hours');
    setEnableUrlEncryption(true);
    setClearCookies(true);
    setErrorNotifications(true);
    setLinkRotationNotifications(true);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-[#424242]">Settings</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[#424242] mb-2">Proxy Configuration</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="server-url" className="block text-sm text-[#424242] mb-1">Server URL</label>
                <input 
                  id="server-url" 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2]" 
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="rotation-interval-setting" className="block text-sm text-[#424242] mb-1">Link Rotation Interval</label>
                <div className="flex space-x-2">
                  <input 
                    id="rotation-interval-setting" 
                    type="number" 
                    min="5" 
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2]" 
                    value={rotationInterval}
                    onChange={(e) => setRotationInterval(parseInt(e.target.value))}
                  />
                  <select 
                    id="rotation-interval-unit" 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2]"
                    value={rotationUnit}
                    onChange={(e) => setRotationUnit(e.target.value as 'minutes' | 'hours')}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[#424242] mb-2">Security</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  id="enable-encryption" 
                  type="checkbox" 
                  className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-gray-300 rounded" 
                  checked={enableUrlEncryption}
                  onChange={(e) => setEnableUrlEncryption(e.target.checked)}
                />
                <label htmlFor="enable-encryption" className="ml-2 block text-sm text-[#424242]">Enable URL encryption</label>
              </div>
              <div className="flex items-center">
                <input 
                  id="clear-cookies" 
                  type="checkbox" 
                  className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-gray-300 rounded" 
                  checked={clearCookies}
                  onChange={(e) => setClearCookies(e.target.checked)}
                />
                <label htmlFor="clear-cookies" className="ml-2 block text-sm text-[#424242]">Clear cookies on session end</label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-[#424242] mb-2">Notifications</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  id="error-notifications" 
                  type="checkbox" 
                  className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-gray-300 rounded" 
                  checked={errorNotifications}
                  onChange={(e) => setErrorNotifications(e.target.checked)}
                />
                <label htmlFor="error-notifications" className="ml-2 block text-sm text-[#424242]">Error notifications</label>
              </div>
              <div className="flex items-center">
                <input 
                  id="link-rotation-notifications" 
                  type="checkbox" 
                  className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-gray-300 rounded" 
                  checked={linkRotationNotifications}
                  onChange={(e) => setLinkRotationNotifications(e.target.checked)}
                />
                <label htmlFor="link-rotation-notifications" className="ml-2 block text-sm text-[#424242]">Link rotation notifications</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 p-4 flex justify-end space-x-3">
          <button 
            id="reset-settings" 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-[#424242] hover:bg-gray-50 transition"
            onClick={handleReset}
          >
            Reset to Default
          </button>
          <button 
            id="save-settings" 
            className="px-4 py-2 bg-[#1976D2] text-white rounded-md text-sm hover:bg-blue-700 transition"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
