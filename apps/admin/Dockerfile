# ==========================================
# BASE LAYER - Package Metadata
# ==========================================
FROM node:24.12.0-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy workspace package files
COPY package*.json ./
COPY turbo.json ./

# Copy all workspace packages manifests
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/
COPY tooling/prettier-config/package.json ./tooling/prettier-config/

# Copy admin package.json
COPY apps/admin/package*.json ./apps/admin/

# ==========================================
# DEPENDENCIES LAYER - Shared Dependencies
# ==========================================
FROM base AS dependencies

# Install ALL dependencies from root
RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts

# ==========================================
# DEVELOPMENT LAYER
# ==========================================
FROM dependencies AS development

# Copy all source code
COPY . .

WORKDIR /app/apps/admin

# Expose Vite dev server port
EXPOSE 5174

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

# Copy all source code
COPY . .

WORKDIR /app

# Build the application using Turbo
RUN npm run build -- --filter=admin

# ==========================================
# PRODUCTION LAYER - Nginx Serving Static Files
# ==========================================
FROM nginx:1.27-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy nginx configuration files
COPY apps/admin/nginx/nginx.conf /etc/nginx/nginx.conf
COPY apps/admin/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nginx-user && \
  adduser -S nginx-user -u 1001 -G nginx-user

# Set ownership and permissions
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
EXPOSE 81

# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
