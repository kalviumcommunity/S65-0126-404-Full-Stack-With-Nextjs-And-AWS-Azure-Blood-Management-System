# ================================
# 1. Base Image - Install dependencies
# ================================
FROM node:20-alpine AS base

# Install libc6-compat (needed for some Next.js deps on Alpine)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency files first for layer caching
COPY package.json package-lock.json ./

# Install dependencies (ci ensures clean install from lockfile)
RUN npm ci


# ================================
# 2. Builder Image - Build the application
# ================================
FROM base AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
# Note: Ensure NEXT_PUBLIC_ variables are provided at build time if needed
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build


# ================================
# 3. Production Image - Run the application
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Set environment variables for the standalone server
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]
