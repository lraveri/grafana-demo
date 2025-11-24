# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY src/ ./src/

# Create logs directory
RUN mkdir -p /app/logs

# Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=debug

# Run the application
CMD ["npm", "start"]

