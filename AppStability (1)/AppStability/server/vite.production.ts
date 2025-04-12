import express, { Express } from 'express';
import path from 'path';

export function serveStaticProduction(app: Express) {
  app.use(express.static(path.resolve('./client/dist')));
  
  // Serve the React app for any route not caught by API or static files
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      // API route that wasn't matched
      return res.status(404).json({ error: 'Not found' });
    }
    
    // Serve the index.html for client-side routing
    res.sendFile(path.resolve('./client/dist/index.html'));
  });
}