import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Proxy links table
export const proxyLinks = pgTable("proxy_links", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(false),
});

export const insertProxyLinkSchema = createInsertSchema(proxyLinks).pick({
  url: true,
  sessionId: true,
  expiresAt: true,
  isActive: true,
});

export type InsertProxyLink = z.infer<typeof insertProxyLinkSchema>;
export type ProxyLink = typeof proxyLinks.$inferSelect;

// Error logs table
export const errorLogs = pgTable("error_logs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  code: text("code"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  severity: text("severity").notNull(), // error, warning, info
});

export const insertErrorLogSchema = createInsertSchema(errorLogs).pick({
  title: true,
  message: true,
  code: true,
  severity: true,
});

export type InsertErrorLog = z.infer<typeof insertErrorLogSchema>;
export type ErrorLog = typeof errorLogs.$inferSelect;

// Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  serverUrl: text("server_url").notNull(),
  rotationInterval: integer("rotation_interval").notNull(), // in minutes
  enableUrlEncryption: boolean("enable_url_encryption").notNull().default(true),
  clearCookiesOnSessionEnd: boolean("clear_cookies_on_session_end").notNull().default(true),
  errorNotifications: boolean("error_notifications").notNull().default(true),
  linkRotationNotifications: boolean("link_rotation_notifications").notNull().default(true),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
