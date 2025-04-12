import React from 'react';

interface ServerStat {
  name: string;
  value: string | number;
  percentage: number;
  color: string;
}

interface ServerStatsProps {
  stats: {
    uptime: number;
    cpuLoad: number;
    memoryUsage: number;
    requestsPerMinute: number;
    lastUpdated: string;
  } | null;
}

export default function ServerStats({ stats }: ServerStatsProps) {
  // If stats are not available yet, show placeholders
  const defaultStats: ServerStat[] = [
    {
      name: 'Uptime',
      value: stats?.uptime.toFixed(1) + '%' || '0%',
      percentage: stats?.uptime || 0,
      color: 'bg-[#4CAF50]'
    },
    {
      name: 'CPU Load',
      value: stats?.cpuLoad + '%' || '0%',
      percentage: stats?.cpuLoad || 0,
      color: 'bg-[#2196F3]'
    },
    {
      name: 'Memory Usage',
      value: stats?.memoryUsage + '%' || '0%',
      percentage: stats?.memoryUsage || 0,
      color: 'bg-[#FFC107]'
    },
    {
      name: 'Requests/min',
      value: stats?.requestsPerMinute || 0,
      percentage: stats ? (stats.requestsPerMinute / 230) * 100 : 0, // Normalize to percentage based on max of ~230
      color: 'bg-[#2196F3]'
    }
  ];

  // Format date for "last updated"
  const lastUpdated = stats?.lastUpdated 
    ? new Date(stats.lastUpdated).toLocaleDateString('en-US', {
        minute: '2-digit',
        hour: '2-digit',
        day: 'numeric',
        month: 'short'
      })
    : 'Never';
  
  // Calculate time difference for "X minutes ago" format
  const getTimeAgo = () => {
    if (!stats?.lastUpdated) return 'Never';
    
    const lastUpdatedDate = new Date(stats.lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - lastUpdatedDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-[#424242] mb-4">Server Statistics</h2>
      
      {defaultStats.map((stat, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-[#424242]">{stat.name}</span>
            <span className="text-sm font-medium">{stat.value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`${stat.color} h-1.5 rounded-full`} 
              style={{ width: `${Math.min(100, Math.max(0, stat.percentage))}%` }}
            ></div>
          </div>
        </div>
      ))}
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-[#424242]">Last update: <span>{getTimeAgo()}</span></p>
        <button className="mt-2 text-xs text-[#1976D2] flex items-center hover:underline">
          View detailed statistics
          <span className="material-icons text-xs ml-0.5">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
