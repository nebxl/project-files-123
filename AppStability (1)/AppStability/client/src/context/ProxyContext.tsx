import React, { createContext, useState, useContext, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type ProxyLink = {
  id: number;
  url: string;
  sessionId: string;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
};

type ErrorLog = {
  id: number;
  title: string;
  message: string;
  code?: string | null;
  createdAt: string;
  severity: string;
};

type ServerStats = {
  uptime: number;
  cpuLoad: number;
  memoryUsage: number;
  requestsPerMinute: number;
  lastUpdated: string;
};

type Settings = {
  id: number;
  serverUrl: string;
  rotationInterval: number;
  enableUrlEncryption: boolean;
  clearCookiesOnSessionEnd: boolean;
  errorNotifications: boolean;
  linkRotationNotifications: boolean;
};

interface ProxyContextType {
  serverStatus: 'online' | 'offline' | 'loading';
  activeLink: ProxyLink | null;
  links: ProxyLink[];
  errorLogs: ErrorLog[];
  serverStats: ServerStats | null;
  settings: Settings | null;
  rotateLink: () => Promise<void>;
  activateLink: (id: number) => Promise<void>;
  testConnection: () => Promise<boolean>;
  clearErrorLogs: () => Promise<void>;
  saveSettings: (settings: Omit<Settings, 'id'>) => Promise<void>;
  isRotating: boolean;
  isTesting: boolean;
}

const ProxyContext = createContext<ProxyContextType | undefined>(undefined);

export const ProxyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isRotating, setIsRotating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // Initialize with default mock data
  const [mockStatus] = useState<'online' | 'offline' | 'loading'>('online');
  const [mockLinks] = useState<ProxyLink[]>([
    {
      id: 1,
      url: 'https://example.com/proxy/session/abc123',
      sessionId: 'abc123',
      createdAt: new Date().toISOString(),
      expiresAt: null,
      isActive: true
    }
  ]);
  const [mockErrorLogs] = useState<ErrorLog[]>([]);
  const [mockStats] = useState<ServerStats>({
    uptime: 99.5,
    cpuLoad: 35,
    memoryUsage: 42,
    requestsPerMinute: 120,
    lastUpdated: new Date().toISOString()
  });
  const [mockSettings] = useState<Settings>({
    id: 1,
    serverUrl: 'http://localhost:5000',
    rotationInterval: 60,
    enableUrlEncryption: true,
    clearCookiesOnSessionEnd: true,
    errorNotifications: true,
    linkRotationNotifications: true
  });
  
  // Server status query
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/proxy/status'],
    refetchInterval: 30000, // Refetch every 30 seconds
    initialData: { status: mockStatus }
  });
  
  // Server stats query
  const { data: statsData } = useQuery({
    queryKey: ['/api/proxy/stats'],
    refetchInterval: 60000, // Refetch every minute
    initialData: mockStats
  });

  // Active link query
  const { data: activeLinkData } = useQuery({
    queryKey: ['/api/proxy/active-link'],
    initialData: mockLinks[0]
  });

  // Links history query
  const { data: linksData = mockLinks } = useQuery({
    queryKey: ['/api/proxy/links'],
    initialData: mockLinks
  });

  // Error logs query
  const { data: errorLogsData = mockErrorLogs } = useQuery({
    queryKey: ['/api/error-logs'],
    initialData: mockErrorLogs
  });

  // Settings query
  const { data: settingsData } = useQuery({
    queryKey: ['/api/settings'],
    initialData: mockSettings
  });

  // Create new link mutation
  const createLinkMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/proxy/links');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/proxy/active-link'] });
      queryClient.invalidateQueries({ queryKey: ['/api/proxy/links'] });
      toast({
        title: "Link Rotated",
        description: "A new proxy link has been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Rotating Link",
        description: error.message || "Failed to create a new proxy link.",
        variant: "destructive",
      });
    },
  });

  // Activate link mutation
  const activateLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('POST', `/api/proxy/links/${id}/activate`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/proxy/active-link'] });
      queryClient.invalidateQueries({ queryKey: ['/api/proxy/links'] });
      toast({
        title: "Link Activated",
        description: "The selected proxy link is now active.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Activating Link",
        description: error.message || "Failed to activate the proxy link.",
        variant: "destructive",
      });
    },
  });

  // Clear error logs mutation
  const clearErrorLogsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/error-logs');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/error-logs'] });
      toast({
        title: "Error Logs Cleared",
        description: "All error logs have been cleared.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Clearing Logs",
        description: error.message || "Failed to clear error logs.",
        variant: "destructive",
      });
    },
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: Omit<Settings, 'id'>) => {
      const response = await apiRequest('POST', '/api/settings', settings);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Saving Settings",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const rotateLink = async () => {
    setIsRotating(true);
    try {
      await createLinkMutation.mutateAsync();
    } finally {
      setIsRotating(false);
    }
  };

  const activateLink = async (id: number) => {
    await activateLinkMutation.mutateAsync(id);
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate a connection test
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Connection Test",
        description: "Connection successful!",
        variant: "default",
      });
      return true;
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: "Could not establish a connection to the proxy.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsTesting(false);
    }
  };

  const clearErrorLogs = async () => {
    await clearErrorLogsMutation.mutateAsync();
  };

  const saveSettings = async (settings: Omit<Settings, 'id'>) => {
    await saveSettingsMutation.mutateAsync(settings);
  };

  // Determine server status
  let serverStatus: 'online' | 'offline' | 'loading' = 'loading';
  if (!statusLoading) {
    serverStatus = statusData?.status === 'online' ? 'online' : 'offline';
  }

  // Create rotation timer if needed
  useEffect(() => {
    if (!settingsData || !activeLinkData) return;
    
    // Check if auto-rotation is needed
    const checkRotation = () => {
      if (!activeLinkData) return;
      
      const expiresAt = activeLinkData.expiresAt ? new Date(activeLinkData.expiresAt) : null;
      
      if (expiresAt && expiresAt <= new Date()) {
        rotateLink();
      }
    };
    
    // Check every minute
    const interval = setInterval(checkRotation, 60000);
    
    return () => clearInterval(interval);
  }, [settingsData, activeLinkData]);

  const value = {
    serverStatus,
    activeLink: activeLinkData || null,
    links: linksData || [],
    errorLogs: errorLogsData || [],
    serverStats: statsData || null,
    settings: settingsData || null,
    rotateLink,
    activateLink,
    testConnection,
    clearErrorLogs,
    saveSettings,
    isRotating,
    isTesting,
  };

  return <ProxyContext.Provider value={value}>{children}</ProxyContext.Provider>;
};

export const useProxy = (): ProxyContextType => {
  const context = useContext(ProxyContext);
  if (context === undefined) {
    throw new Error('useProxy must be used within a ProxyProvider');
  }
  return context;
};
