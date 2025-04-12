import { apiRequest } from './queryClient';

// Format time from minutes to a readable format (e.g., "32m" or "1h 2m")
export function formatTimeRemaining(expiresAt: string | null | undefined): string {
  if (!expiresAt) return 'Unknown';
  
  const expiry = new Date(expiresAt);
  const now = new Date();
  
  if (expiry <= now) {
    return 'Expired';
  }
  
  const diffMs = expiry.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
}

// Format date relative to now (e.g., "2 minutes ago", "Now", etc.)
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) {
    return 'Now';
  }
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text to clipboard', error);
    return false;
  }
}

// Open URL in a new tab
export function openUrl(url: string): void {
  window.open(url, '_blank');
}
