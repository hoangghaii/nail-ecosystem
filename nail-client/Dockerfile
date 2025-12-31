# ==========================================
# BASE LAYER - Package Metadata
# ==========================================
FROM node:24.12.0-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy only package files (for dependency layer caching)
COPY package*.json ./

# ==========================================
# DEPENDENCIES LAYER - Shared Dependencies
# ==========================================
FROM base AS dependencies

# Install ALL dependencies (including devDependencies)
# --ignore-scripts prevents husky prepare script from running
# BuildKit cache mount speeds up npm downloads across builds
RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts

# ==========================================
# DEVELOPMENT LAYER
# ==========================================
FROM dependencies AS development

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S viteuser -u 1001 -G nodejs && \
  chown -R viteuser:nodejs /app

USER viteuser

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==========================================
# BUILDER LAYER
# ==========================================
FROM dependencies AS builder

# Set CI mode for npm
ENV CI=true

# Copy source code
COPY . .

# Build the application
# Set NODE_ENV=production for build optimization
RUN NODE_ENV=production npm run build && \
  npm prune --production && \
  npm cache clean --force && \
  rm -rf \
  src \
  tsconfig*.json \
  vite.config.ts


# ==========================================
# PRODUCTION LAYER - Nginx Serving Static Files
# ==========================================
FROM nginx:1.27-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy nginx configuration files (as root, before switching user)
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
# Only static files needed - no node_modules required for nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nginx-user && \
  adduser -S nginx-user -u 1001 -G nginx-user

# Set ownership and permissions for nginx directories and config files
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
  chown -R nginx-user:nginx-user /var/cache/nginx && \
  chown -R nginx-user:nginx-user /var/log/nginx && \
  chown -R nginx-user:nginx-user /etc/nginx/nginx.conf && \
  chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R nginx-user:nginx-user /var/run/nginx.pid

# Switch to non-root user
USER nginx-user

# Expose HTTP port
EXPOSE 80

# Use dumb-init as entrypoint for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
