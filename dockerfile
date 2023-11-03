# This dockerfile specifies the environment the production
# code will be run in, along with what files are needed
# for production

# Use an official Node.js runtime as the base image
FROM --platform=linux/arm64 node:20.8.1-bookworm-slim

# Create a user within the container
RUN useradd -m frontend_user

# Switch to user for subsequent commands
USER frontend_user

# Set working directory
WORKDIR /app

# Copy the `.next` dist directory and package.json
COPY .next/ ./.next/
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]