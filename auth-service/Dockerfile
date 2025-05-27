# Use Node.js base image
FROM node:24.0.0

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies first (for caching)
COPY package.json yarn.lock ./
RUN npm install

# Copy all source files into the container
COPY . .

# Build the TypeScript files
RUN npm run build

# Start the application
CMD ["npm", "start"]
