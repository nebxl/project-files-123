import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import rammerheadServer from "./rammerhead";
import { z } from "zod";
import { insertSettingsSchema, insertErrorLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Initialize the Rammerhead server
  await rammerheadServer.initialize();
  await rammerheadServer.start();

  // API routes
  app.get("/api/proxy/status", async (req: Request, res: Response) => {
    const isRunning = rammerheadServer.getStatus();
    res.json({ status: isRunning ? "online" : "offline" });
  });

  // Get server stats
  app.get("/api/proxy/stats", (req: Request, res: Response) => {
    const stats = rammerheadServer.getServerStats();
    res.json(stats);
  });

  // Get active proxy link
  app.get("/api/proxy/active-link", async (req: Request, res: Response) => {
    const activeLink = await storage.getActiveProxyLink();
    res.json(activeLink || null);
  });

  // Get all proxy links
  app.get("/api/proxy/links", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const links = await storage.getAllProxyLinks(limit);
    res.json(links);
  });

  // Create new proxy link
  app.post("/api/proxy/links", async (req: Request, res: Response) => {
    // First, deactivate all existing links
    await storage.deactivateAllProxyLinks();
    
    // Create a new session
    const sessionId = rammerheadServer.createSession();
    const url = rammerheadServer.getSessionUrl(sessionId);
    
    // Get rotation interval from settings
    const settings = await storage.getSettings();
    const rotationInterval = settings?.rotationInterval || 60; // Default to 60 minutes
    
    // Set expiration time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + rotationInterval);
    
    // Create and save the new link
    const newLink = await storage.createProxyLink({
      url,
      sessionId,
      expiresAt,
      isActive: true
    });
    
    res.json(newLink);
  });

  // Set a link as active
  app.post("/api/proxy/links/:id/activate", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const activatedLink = await storage.setProxyLinkActive(id);
    
    if (!activatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    res.json(activatedLink);
  });

  // Get error logs
  app.get("/api/error-logs", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const logs = await storage.getErrorLogs(limit);
    res.json(logs);
  });

  // Create error log
  app.post("/api/error-logs", async (req: Request, res: Response) => {
    try {
      const validatedData = insertErrorLogSchema.parse(req.body);
      const log = await storage.createErrorLog(validatedData);
      res.json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid error log data", errors: error.errors });
      }
      throw error;
    }
  });

  // Clear error logs
  app.delete("/api/error-logs", async (req: Request, res: Response) => {
    await storage.clearErrorLogs();
    res.json({ success: true });
  });

  // Get settings
  app.get("/api/settings", async (req: Request, res: Response) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  // Update settings
  app.post("/api/settings", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.saveSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      throw error;
    }
  });

  return httpServer;
}
