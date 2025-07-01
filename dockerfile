# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json and pnpm-lock.yaml to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner

# Install pnpm globally again for production container
RUN npm install -g pnpm

WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]


#  You can now build your Docker image using docker build -t grievance-system . and run it with docker run -p 3000:3000 grievance-system.