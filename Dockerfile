# Use lightweight Node.js Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the development server with --host flag and port 3000 for external access
CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]

