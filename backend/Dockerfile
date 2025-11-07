FROM node:22-slim@sha256:d943bf20249f8b92eff6f605362df2ee9cf2d6ce2ea771a8886e126ec8714f08 as base
WORKDIR /app
# Copy package files and install dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 2nd stage
FROM node:22-slim@sha256:d943bf20249f8b92eff6f605362df2ee9cf2d6ce2ea771a8886e126ec8714f08 as production
WORKDIR /app

# Copy dependencies and package files from the base stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./

# Copy source code
COPY . .

ENV NODE_ENV=production
# Build the application
RUN npm run build

RUN npm prune --production


RUN groupadd -r appuser && useradd -r -g appuser appuser
# Change ownership of the entire app directory
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 4000

CMD ["npm", "run", "start"]