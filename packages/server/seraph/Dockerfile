# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if necessary)
# RUN npm run build

# Expose the port (if running a server)
# EXPOSE 3000

# Set the command to run the Seraph CLI
CMD ["npm", "start"]