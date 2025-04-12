import { 
  User, 
  InsertUser, 
  ProxyLink, 
  InsertProxyLink, 
  ErrorLog, 
  InsertErrorLog,
  Settings,
  InsertSettings
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Proxy link methods
  getProxyLink(id: number): Promise<ProxyLink | undefined>;
  getActiveProxyLink(): Promise<ProxyLink | undefined>;
  getAllProxyLinks(limit?: number): Promise<ProxyLink[]>;
  createProxyLink(link: InsertProxyLink): Promise<ProxyLink>;
  setProxyLinkActive(id: number): Promise<ProxyLink | undefined>;
  deactivateAllProxyLinks(): Promise<void>;
  
  // Error log methods
  getErrorLogs(limit?: number): Promise<ErrorLog[]>;
  createErrorLog(log: InsertErrorLog): Promise<ErrorLog>;
  clearErrorLogs(): Promise<void>;
  
  // Settings methods
  getSettings(): Promise<Settings | undefined>;
  saveSettings(settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private proxyLinks: Map<number, ProxyLink>;
  private errorLogs: Map<number, ErrorLog>;
  private settingsData: Settings | undefined;
  
  private userCurrentId: number;
  private proxyLinkCurrentId: number;
  private errorLogCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.proxyLinks = new Map();
    this.errorLogs = new Map();
    this.userCurrentId = 1;
    this.proxyLinkCurrentId = 1;
    this.errorLogCurrentId = 1;
    
    // Initialize with default settings
    this.settingsData = {
      id: 1,
      serverUrl: 'http://localhost:5000',
      rotationInterval: 60, // 1 hour in minutes
      enableUrlEncryption: true,
      clearCookiesOnSessionEnd: true,
      errorNotifications: true,
      linkRotationNotifications: true
    };
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Proxy link methods
  async getProxyLink(id: number): Promise<ProxyLink | undefined> {
    return this.proxyLinks.get(id);
  }
  
  async getActiveProxyLink(): Promise<ProxyLink | undefined> {
    return Array.from(this.proxyLinks.values()).find(link => link.isActive);
  }
  
  async getAllProxyLinks(limit?: number): Promise<ProxyLink[]> {
    const links = Array.from(this.proxyLinks.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return limit ? links.slice(0, limit) : links;
  }
  
  async createProxyLink(insertLink: InsertProxyLink): Promise<ProxyLink> {
    const id = this.proxyLinkCurrentId++;
    const now = new Date();
    const link: ProxyLink = { 
      ...insertLink, 
      id, 
      createdAt: now,
      expiresAt: insertLink.expiresAt || null,
      isActive: insertLink.isActive || false
    };
    this.proxyLinks.set(id, link);
    return link;
  }
  
  async setProxyLinkActive(id: number): Promise<ProxyLink | undefined> {
    // First deactivate all links
    await this.deactivateAllProxyLinks();
    
    // Then activate the specified link
    const link = this.proxyLinks.get(id);
    if (link) {
      const updatedLink: ProxyLink = { ...link, isActive: true };
      this.proxyLinks.set(id, updatedLink);
      return updatedLink;
    }
    return undefined;
  }
  
  async deactivateAllProxyLinks(): Promise<void> {
    this.proxyLinks.forEach((link, id) => {
      this.proxyLinks.set(id, { ...link, isActive: false });
    });
  }
  
  // Error log methods
  async getErrorLogs(limit?: number): Promise<ErrorLog[]> {
    const logs = Array.from(this.errorLogs.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return limit ? logs.slice(0, limit) : logs;
  }
  
  async createErrorLog(insertLog: InsertErrorLog): Promise<ErrorLog> {
    const id = this.errorLogCurrentId++;
    const now = new Date();
    const log: ErrorLog = { 
      ...insertLog, 
      id, 
      createdAt: now,
      code: insertLog.code || null
    };
    this.errorLogs.set(id, log);
    return log;
  }
  
  async clearErrorLogs(): Promise<void> {
    this.errorLogs.clear();
  }
  
  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    return this.settingsData;
  }
  
  async saveSettings(settings: InsertSettings): Promise<Settings> {
    this.settingsData = { 
      id: 1, 
      serverUrl: settings.serverUrl,
      rotationInterval: settings.rotationInterval,
      enableUrlEncryption: settings.enableUrlEncryption ?? true,
      clearCookiesOnSessionEnd: settings.clearCookiesOnSessionEnd ?? true,
      errorNotifications: settings.errorNotifications ?? true,
      linkRotationNotifications: settings.linkRotationNotifications ?? true
    };
    return this.settingsData;
  }
}

export const storage = new MemStorage();
