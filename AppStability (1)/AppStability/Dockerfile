FROM node:18-alpine as builder

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Production stage using a smaller image
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/node_modules ./node_modules

# Expose the port
EXPOSE 8080

# Create a non-root user to run the application (security best practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the app
CMD ["node", "server/index.js"]