# ===== Stage 1: Build =====
FROM node:18-alpine AS builder
WORKDIR /app

# Install all dependencies (dev + prod)
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript to JS
RUN npm run build

# ===== Stage 2: Production =====
FROM node:18-alpine
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the compiled app
CMD ["node", "dist/server.js"]
