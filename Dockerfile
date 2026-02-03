FROM node:20-bullseye-slim

# Create app directory
WORKDIR /app

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy dependency manifests first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (no dev deps not strictly needed for build could be pruned later)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build client and server
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3000

# Start compiled server
CMD ["node", "dist/server/index.js"]
