# ==========================================
# BASE LAYER - Package Metadata
# ==========================================
FROM node:20.18.2-alpine AS base

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
COPY tooling/prettier-config/package.json ./tooling/prettier-config/

# Copy API package.json
COPY apps/api/package*.json ./apps/api/

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

WORKDIR /app/apps/api

# Expose API port
EXPOSE 3000

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001 -G nodejs && \
  chown -R nestjs:nodejs /app

USER nestjs

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "start:dev"]

# ==========================================
# BUILD LAYER - Compile TypeScript
# ==========================================
FROM dependencies AS builder

# Copy all source code
COPY . .

WORKDIR /app

# Build the application using Turbo
RUN npm run build -- --filter=api

# ==========================================
# PRODUCTION DEPENDENCIES LAYER
# ==========================================
FROM base AS production-deps

# Install production dependencies only
RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts --omit=dev

# ==========================================
# PRODUCTION LAYER - Final production image
# ==========================================
FROM node:20.18.2-alpine AS production

# Install dumb-init
RUN apk add --no-cache dumb-init

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001 -G nodejs

# Copy production dependencies
COPY --from=production-deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package*.json ./

# Switch to non-root user
USER nestjs

# Environment variables
ENV NODE_ENV=production \
  PORT=3000

# Expose API port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
