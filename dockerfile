# Base Image
FROM node:20

# Create app user
RUN useradd -m myappuser

# Switch to app user
USER myappuser

# Set the working directory
WORKDIR /home/myappuser/app

# Copy package*.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]