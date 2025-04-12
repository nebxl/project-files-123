import React from 'react';

interface AlertBannerProps {
  title: string;
  message: string;
  severity: 'warning' | 'error' | 'info';
  onClose: () => void;
}

export default function AlertBanner({ title, message, severity, onClose }: AlertBannerProps) {
  // Determine the appropriate color based on severity
  const bgColor = severity === 'warning' ? 'bg-[#FFC107] bg-opacity-10 border-[#FFC107] text-[#FFC107]' :
                  severity === 'error' ? 'bg-[#F44336] bg-opacity-10 border-[#F44336] text-[#F44336]' :
                  'bg-[#2196F3] bg-opacity-10 border-[#2196F3] text-[#2196F3]';
  
  const icon = severity === 'warning' ? 'warning' :
               severity === 'error' ? 'error' : 'info';
               
  return (
    <div className={`mb-6 rounded-lg ${bgColor} border text-[#424242] p-4 flex items-start`}>
      <span className={`material-icons mr-3 mt-0.5 text-${severity === 'warning' ? '[#FFC107]' : 
                        severity === 'error' ? '[#F44336]' : '[#2196F3]'}`}>
        {icon}
      </span>
      <div>
        <h3 className={`font-medium text-${severity === 'warning' ? '[#FFC107]' : 
                        severity === 'error' ? '[#F44336]' : '[#2196F3]'}`}>
          {title}
        </h3>
        <p className="text-sm">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-auto p-1" 
        aria-label="Close alert"
      >
        <span className="material-icons text-[#424242]">close</span>
      </button>
    </div>
  );
}
