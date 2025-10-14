FROM node:22-slim@sha256:d943bf20249f8b92eff6f605362df2ee9cf2d6ce2ea771a8886e126ec8714f08

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .


RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000