# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "run", "start:dev"]
