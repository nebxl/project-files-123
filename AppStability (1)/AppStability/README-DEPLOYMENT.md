# Rammerhead Proxy Manager Deployment Guide

This guide will help you deploy the Rammerhead Proxy Manager to Fly.io.

## Prerequisites

- [Fly CLI installed](https://fly.io/docs/hands-on/install-flyctl/)
- A Fly.io account (sign up at [fly.io](https://fly.io))

## Deployment Steps

1. **Sign in to Fly.io**
   ```bash
   fly auth login
   ```

2. **Launch your app on Fly.io**
   Navigate to your project directory and run:
   ```bash
   fly launch
   ```
   This will guide you through creating a new application on Fly.io. It will also create a `fly.toml` file.

3. **Deploy your app**
   ```bash
   fly deploy
   ```

4. **Check app status**
   ```bash
   fly status
   ```

5. **View logs**
   ```bash
   fly logs
   ```

## Important Deployment Files

The following files are optimized for deployment to Fly.io:

### Dockerfile
A multi-stage build process that creates a smaller production image:
- Builds the app in a builder stage
- Creates a minimal production image
- Uses an Alpine Linux base image for smaller size
- Creates a non-root user for security
- Sets appropriate environment variables

### fly.toml
Configuration for Fly.io deployment:
- Sets the application name
- Configures ports and protocols
- Sets environment variables
- Configures health checks
- Sets up auto-scaling parameters

### .fly/entrypoint.sh
Script to optimize Node.js memory usage in the container environment.

### server/vite.production.ts
Optimized static file serving for production environments.

## Security Recommendations

1. **Environment Variables**
   Add sensitive information as secrets:
   ```bash
   fly secrets set MY_SECRET=value
   ```

2. **Resource Scaling**
   Adjust the VM size based on your needs:
   ```bash
   fly scale vm shared-cpu-1x
   ```

## Troubleshooting

If you encounter issues:

1. **Check logs**
   ```bash
   fly logs
   ```

2. **SSH into your app**
   ```bash
   fly ssh console
   ```

3. **Restart the app**
   ```bash
   fly apps restart
   ```

## Local Testing Before Deployment

Test the Docker build locally:
```bash
docker build -t rammerhead-proxy-manager .
docker run -p 8080:8080 rammerhead-proxy-manager
```

Visit `http://localhost:8080` to test the app locally.

## Package.json Build Command

When you download the project, make sure to update the build script in package.json:

```json
"build": "vite build && esbuild server/index.ts server/vite.production.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

This ensures that the production static file server is included in the build.